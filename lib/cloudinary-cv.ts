function toCloudinarySegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function getCandidateCvAsset({
  faculty,
  department,
  studentId,
}: {
  faculty: string;
  department: string;
  studentId: string;
}) {
  const folder = `${toCloudinarySegment(faculty)}/${toCloudinarySegment(department)}`;
  const publicId = `${studentId.toUpperCase()}.pdf`;

  return {
    folder,
    publicId,
    fullPublicId: `${folder}/${publicId}`,
  };
}
