import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/db";

export const runtime = "nodejs";

const maximumFileSize = 5 * 1024 * 1024;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "candidate") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("Candidate CV upload requires Cloudinary credentials");
    return NextResponse.json(
      { error: "CV upload is temporarily unavailable" },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Select a PDF file" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Your CV must be a PDF file" },
      { status: 400 },
    );
  }

  if (file.size > maximumFileSize) {
    return NextResponse.json(
      { error: "Your CV must be 5 MB or smaller" },
      { status: 400 },
    );
  }

  const candidateResult = await query(
    "SELECT id FROM candidates WHERE user_id = $1",
    [session.user.id],
  );
  if (candidateResult.rowCount === 0) {
    return NextResponse.json(
      { error: "Candidate profile not found" },
      { status: 404 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "riseupmora/candidate-cvs",
          public_id: `candidate-${session.user.id}-${Date.now()}`,
          filename_override: file.name,
        },
        (error, result) => {
          if (error || !result) reject(error || new Error("Upload failed"));
          else resolve(result);
        },
      );
      stream.end(buffer);
    });

    await query(
      `UPDATE candidates
       SET cv_url = $1
       WHERE user_id = $2`,
      [uploadResult.secure_url, session.user.id],
    );

    return NextResponse.json({
      success: true,
      message: "Your CV has been uploaded successfully",
      url: uploadResult.secure_url,
    });
  } catch (error: unknown) {
    console.error("Candidate CV upload error:", error);
    return NextResponse.json(
      { error: "Unable to upload your CV. Please try again." },
      { status: 500 },
    );
  }
}
