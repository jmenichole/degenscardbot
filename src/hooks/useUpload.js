import React from 'react';

function useUpload() {
  const [loading, setLoading] = React.useState(false);

  const upload = React.useCallback(async (input) => {
    try {
      setLoading(true);
      let response;

      if ("file" in input && input.file) {
        const formData = new FormData();
        formData.append("file", input.file);
        response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
      } else if ("url" in input) {
        response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: input.url })
        });
      } else if ("base64" in input) {
        response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64: input.base64 })
        });
      } else {
        response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/octet-stream" },
          body: input.buffer
        });
      }

      if (!response.ok) {
        if (response.status === 413) throw new Error("File too large.");
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return { url: data.url, mimeType: data.mimeType || null };

    } catch (error) {
      return { error: error.message || "Upload failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  return [upload, { loading }];
}

export { useUpload };
