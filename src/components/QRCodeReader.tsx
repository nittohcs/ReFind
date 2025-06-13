"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import jsQR from "jsqr";

type QRCodeReaderProps = {
    onRead: (data: string) => Promise<boolean>,
};

export const QRCodeReader: FC<QRCodeReaderProps> = ({
    onRead
}) => {
    const [hasCamera, setHasCamera] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("カメラのある端末で表示してください。");
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    // onReadをuseEffectの依存配列に入れるとuseEffectが複数回動いてstreamが複数回取得されてカメラの停止ができなくなる場合があるのでrefにしている
    const onReadRef = useRef(onRead);
    const lastProcessedQRCode = useRef<string>("");
    const initializedRef = useRef(false);

    
    const [facingMode] = useState<"user" | "environment">("environment");


    // refにonReadの最新の値を格納し続ける
    useEffect(() => {
        onReadRef.current = onRead;
    }, [onRead]);

    useEffect(() => {
        // useEffectの依存配列にhasCameraを入れるとuseEffectの処理が何度も動いてしまう
        // 1回だけ動いてほしいのでローカル変数にする
        let tmpHasCamera: boolean = false;
        const tmpSetHasCamera = (value: boolean) => {
            tmpHasCamera = value;
            setHasCamera(value);
        };

        const checkCamera = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const cameras = devices.filter(x => x.kind === "videoinput");
                tmpSetHasCamera(cameras.length > 0);
            } catch(error) {
                console.log("checkCamera", error);
                tmpSetHasCamera(false);
            }
        };

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: {facingMode} });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().catch(error => {
                            console.log("startCamera: videoRef.current?.play()", error);
                        });
                    };

                    setTimeout(() => {
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                        }
                    }, 100);
                }
            } catch (error) {
                console.log("startCamera", error);

                // カメラ権限に関連するエラーを判定
                if (error instanceof DOMException) {
                    switch(error.name) {
                        case "NotAllowedError":
                            setErrorMessage("カメラの使用が許可されていません。ブラウザの設定でカメラの権限を確認してください。");
                            break;

                        case "AbortError":
                            setErrorMessage("カメラ接続が中断されました。再試行してください。");
                            break;

                        default:
                            setErrorMessage("カメラにアクセスできません。");
                            break;
                    }
                }

                tmpSetHasCamera(false);
            }
        };

        // video要素が最前面に表示されているかどうかを返す
        const isVideoObscured = (videoElement: HTMLVideoElement) => {
            const videoRect = videoElement.getBoundingClientRect();
            const elements = document.elementsFromPoint(videoRect.left + videoRect.width / 2, videoRect.top + videoRect.height / 2);
            return elements[0] !== videoElement;
        }

        const scanQRCode = async () => {
            try {
                // ダイアログが表示されてるとかでvideo要素が最前面に表示されていない場合、QRコード読み取り処理を行わないようにしている
                if (videoRef.current && canvasRef.current && !isVideoObscured(videoRef.current)) {
                    const canvas = canvasRef.current;
                    const video = videoRef.current;
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;

                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);

                        if (code) {
                            if (!lastProcessedQRCode.current) {
                                lastProcessedQRCode.current = code.data;

                                // 読み込んだQRコードで処理できたら終了
                                if (await onReadRef.current(code.data)) {
                                    return;
                                }

                                lastProcessedQRCode.current = "";
                            }
                        }
                    }
                }
            } catch (error) {
                console.log("scanQRCode", error);
            }

            requestAnimationFrame(scanQRCode);
        };

        const stopCamera = () => {
            try {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
                streamRef.current = null;
            } catch(error) {
                console.error("stopCamera", error);
            }
        };

        // 開発サーバでuseEffectを1回だけ実行する
        if (!initializedRef.current) {
            initializedRef.current = true;
            (async () => {
                await checkCamera();
                if (tmpHasCamera) {
                    await startCamera();
                    await scanQRCode();
                }
            })();
        }

        return () => {
            // コンポーネントのアンマウント時にカメラを無効化
            stopCamera();
        };
    }, [facingMode]);

    return (
        <>
            {/* <Button
                variant="contained"
                onClick={async () => {
                //stopCamera();
                setFacingMode(prev => prev === "user" ? "environment" : "user");
            }}
            >
            カメラ切り替え
            </Button> */}

            {hasCamera === null ? (
                <></>
            ) : hasCamera ? (
                <Box>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        style={{ display: "none"}}
                    />                    
                </Box>
            ) : (
                <Typography>{errorMessage}</Typography>
            )}
        </>
    );
}
export default QRCodeReader;
