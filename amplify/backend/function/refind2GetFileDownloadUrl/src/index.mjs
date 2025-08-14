/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_REFIND2STORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.REGION;
const BUCKETNAME = process.env.STORAGE_REFIND2STORAGE_BUCKETNAME;

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    
    const filePath = event.arguments?.filePath ?? "";
    const expiresIn = event.arguments?.expiresIn ?? 900;

    const groups = event.identity?.groups;
    // sysAdminsじゃないならtenantIdをチェックする
    if (groups.indexOf("sysAdmins") < 0) {
        const tenantId = groups.find(x => x !== "sysAdmins" && x !== "admins" && x !== "users") ?? "";
        if (!tenantId) {
            throw new Error("Empty tenantId");
        }
        
        if (!filePath.startsWith(`public/${tenantId}/`)) {
            if (filePath.startsWith("public/common/")) {
                // 共通ファイル置き場はセーフ
            } else {
                // 自分のテナントのフォルダ以外はアクセス不可
                throw new Error("Invalid tenantId");
            }
        }
    }

    const s3Client = new S3Client({ region: REGION });
    const command = new GetObjectCommand({
        Bucket: BUCKETNAME,
        Key: filePath
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
};
