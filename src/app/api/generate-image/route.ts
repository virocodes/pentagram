import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    // TODO: Call your Image Generation API here
    const url = new URL(process.env.MODAL_ENDPOINT!);
    url.searchParams.set("prompt", text);
    const response = await fetch(url.toString(), {
      headers: {
        "X-API-KEY": process.env.MODAL_API_KEY!,
      },
    });
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";
    console.log(response);
    const fileName = `${Date.now()}.${contentType.split("/")[1]}`;
    
    const uploadParams = {
      Bucket: "images",
      Key: fileName,
      Body: Buffer.from(buffer),
      ContentType: contentType,
    }

    const command = new PutObjectCommand(uploadParams);
    await r2Client.send(command);

    // Use your Cloudflare R2 public URL
    const imageUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;

    return NextResponse.json({
      success: true,
      image: imageUrl,
      caption: text,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
