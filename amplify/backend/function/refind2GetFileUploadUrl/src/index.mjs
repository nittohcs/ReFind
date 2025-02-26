/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_REFIND2STORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.REGION;
const BUCKETNAME = process.env.STORAGE_REFIND2STORAGE_BUCKETNAME;

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler}
 */
export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const filePath = event.arguments?.filePath ?? "";
    const groups = event.identity?.groups ?? [];

    // sysAdminsじゃないならtenantIdをチェックする
    if (groups.indexOf("sysAdmins") < 0) {
        const tenantId = groups.find(x => x !== "sysAdmins" && x !== "admins" && x !== "users") ?? "";
        if (!tenantId) {
            throw new Error("Empty tenantId");
        }

        if (!filePath.startsWith(`public/${tenantId}/`)) {
            throw new Error("Invalid tenantId");
        }

        // admins以外の場合、アップロードできるのは自分のアイコン画像だけ
        if (groups.indexOf("admins") < 0) {
            const userId = event.identity?.username ?? "";
            if (filePath !== `public/${tenantId}/users/${userId}`) {
                throw new Error("Invalid filePath");
            }
        }
    }

    const s3Client = new S3Client({ region: REGION });

    const command = new PutObjectCommand({
        Bucket: BUCKETNAME,
        Key: filePath,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    
    return signedUrl;
};
