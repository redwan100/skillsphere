import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@uploadthing/react";
import toast from "react-hot-toast";

type FileUploadProps = {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone<typeof ourFileRouter, typeof endpoint>
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => {
        console.error(error);
        toast.error(error?.message);
      }}
    />
  );
};
