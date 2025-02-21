"use client";

import React, { FC, PropsWithChildren, useEffect } from "react";
import { I18n } from "aws-amplify/utils";
import { Authenticator, Image, View, translations, useAuthenticator, useTheme } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { AuthStateContext, UpdateUserInfoContext, useAuthContextValue } from "@/hooks/auth";
import { useEnvName } from "@/hooks/ui";

const SetUIVocabularies = (lang: string) => {
    I18n.putVocabularies(translations);
    I18n.setLanguage(lang);

    I18n.putVocabulariesForLanguage("ja", {
        // タブ名
        "Sign In": "ログイン",
        "Create Account": "アカウント作成",

        // サインイン
        "Sign in": "ログイン",
        "Signing in": "ログイン...",
        "Username": "ユーザーID",
        "Enter your Username": "ユーザーIDを入力",
        "Password": "パスワード",
        "Enter your Password": "パスワードを入力",
        "Forgot your password?": "パスワードのリセット",

        // アカウント作成
        "Password must have at least 8 characters": "パスワードは8文字以上入力してください。",
        "Your passwords must match": "パスワード(確認用)はパスワードと同じ値を入力してください。",
        "Confirm Password": "パスワード(確認用)",
        "Please confirm your Password": "パスワードを入力",
        "Email": "メールアドレス",
        "Enter your Email": "メールアドレスを入力",
        "Name": "氏名",
        "Enter your Name": "氏名を入力",

        // パスワードのリセット
        "Reset Password": "パスワードのリセット",
        "Enter your username": "ユーザーIDを入力",
        "Send code": "コードを送信",
        "Back to Sign In": "ログイン画面に戻る",

        // パスワードのリセット（コード送信後）
        "Code *": "コード",
        "Code": "コードを入力",
        "New Password": "新しいパスワード",
        "Submit": "送信",
        "Resend Code": "コードを再送信",
        "Submitting": "送信中",

        // cognitoからのメッセージ
        // 次のページにある翻訳を利用
        // https://qiita.com/ssugimoto/items/697ff173cc18ed860ed0
        'User does not exist.': 'ユーザーが存在しません',
        'Incorrect username or password.': 'ユーザー名またはパスワードが違います',
        'User is not confirmed.': 'ユーザーは検証されていません',
        'User already exists': 'ユーザーは既に存在します',
        'Invalid verification code provided, please try again.': '指定された確認コードが無効です。もう一度お試しください',
        'Invalid password format': 'パスワードのフォーマットが不正です',
        'Account recovery requires verified contact information': 'アカウントの復旧には確認済みの連絡先情報が必要です',
        'Invalid phone number format': '不正な電話番号フォーマットです。 電話番号は次のフォーマットで入力してください: +12345678900',
        'An account with the given email already exists.': 'そのメールアドレスは既に存在します',
        'Username cannot be empty': 'ユーザー名は必須です',
        'Password attempts exceeded': 'ログイン試行回数が上限に達しました',
        'Attempt limit exceeded, please try after some time.': '試行制限を超過しました。しばらくしてからもう一度お試しください',
        'Username/client id combination not found.': 'ユーザーが存在しません',
        'CUSTOM_AUTH is not enabled for the client.': 'パスワードは必須です', // 本来の意味とは異なるが、パスワード未入力時に発生するのでこの訳としている
        'Password does not conform to policy: Password not long enough': 'パスワードは8文字以上を入力してください (8文字以上の大文字小文字を含む英数字)', // 適宜修正
        'Password does not conform to policy: Password must have uppercase characters': 'パスワードには大文字を含めてください (8文字以上の大文字小文字を含む英数字)', // 適宜修正
        'Password does not conform to policy: Password must have lowercase characters': 'パスワードには小文字を含めてください (8文字以上の大文字小文字を含む英数字)', // 適宜修正
        'Password does not conform to policy: Password must have numeric characters': 'パスワードには数字を含めてください (8文字以上の大文字小文字を含む英数字)', // 適宜修正
        "1 validation error detected: Value at 'password' failed to satisfy constraint: Member must have length greater than or equal to 6": 'パスワードは8文字以上、大文字小文字を含む英数字を指定してください', // 適宜修正。本来の意味とは異なるがこれで明示している。
        "2 validation errors detected: Value at 'password' failed to satisfy constraint: Member must have length greater than or equal to 6; Value at 'password' failed to satisfy constraint: Member must satisfy regular expression pattern: ^[\S]+.*[\S]+$": 'パスワードは8文字以上、大文字小文字を含む英数字を指定してください', // 適宜修正。本来の意味とは異なるがこれで明示している。
        'Temporary password has expired and must be reset by an administrator.': '一時パスワードは無効です。管理者によるリセットが必要です',
        "1 validation error detected: Value null at 'attributeName' failed to satisfy constraint: Member must not be null": '入力チェックエラー、必須項目がNULLです', //アカウント復旧でのメールアドレスのラジオをチェックONにせず、送信した場合
        'Invalid code received for user': '無効なコードです', // TOTPでのトークンに誤りがある
        'Invalid session for the user, session is expired.': '無効なセッション、セッションは有効期限切れです。ログインからやり直してください', // ログインセッション無効です、ログインからやり直し

        // cognito空のメッセージ（追加）
        "User is disabled.": "ユーザーは無効化されています。",
    });

    // デフォルト英語の気に入らないところだけを上書き
    I18n.putVocabulariesForLanguage("en", {
        // タブ名
        "Sign In": "Log In",

        // サインイン
        "Sign in": "Log in",
        "Signing in": "Logging in...",
        "Username": "User ID",
        "Enter your Username": "Enter your User ID",

        // パスワードのリセット
        "Enter your username": "Enter your User ID",
        "Back to Sign In": "Back to Log In",
    });
};

SetUIVocabularies("ja");

const components = {
    Header() {
        const { tokens } = useTheme();
        const env = useEnvName();

        return (
            <View textAlign="center" padding={tokens.space.large}>
                <Image width={198} height={58} alt="ReFind" src={`/img/ReFind_logo-${env}.png`} />
            </View>
        );
    },
    SignIn: {
        Footer() {
            return <View></View>;
        },
    },
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const { authState, updateUserInfo } = useAuthContextValue();
    const { authStatus, route } = useAuthenticator(x => [x.authStatus, x.route]);

    // Authenticatorの言語を設定
    useEffect(() => {
        I18n.setLanguage("ja");
    }, []);

    if (authStatus !== "authenticated" || route !== "authenticated") {
        return (
            <Authenticator
                components={components}
                hideSignUp={true}
            />
        );
    }

    return (
        <AuthStateContext.Provider value={authState}>
            <UpdateUserInfoContext.Provider value={updateUserInfo}>
                {children}
            </UpdateUserInfoContext.Provider>
        </AuthStateContext.Provider>
    );
};
export default AuthProvider;
