import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Video } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [sendStatus, setSendStatus] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  // Handle media file selection
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const validVideoTypes = ["video/mp4", "video/webm"];
    if (![...validImageTypes, ...validVideoTypes].includes(file.type)) {
      toast.error("Please select an image (JPEG, PNG, GIF) or video (MP4, WebM)");
      return;
    }

    // Check file size (e.g., max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
      setMediaType(file.type.startsWith("image/") ? "image" : "video");
      setSendStatus(null);
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    reader.readAsDataURL(file);
  };

  // Remove selected media
  const removeMedia = () => {
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSendStatus(null);
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !mediaPreview) {
      toast.error("Please enter a message or select media");
      return;
    }

    try {
      console.log("Sending message:", { text: text.trim(), mediaPreview, mediaType });
      await sendMessage({
        text: text.trim(),
        media: mediaPreview,
        mediaType,
      });
      setSendStatus({ type: "success", message: "Message sent successfully!" });
      toast.success("Message sent!");
      setText("");
      setMediaPreview(null);
      setMediaType(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error.message, error.stack);
      setSendStatus({
        type: "error",
        message: `Failed to send message: ${error.message || "Unknown error"}`,
      });
      toast.error(`Failed to send: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="p-4 w-full">
      {mediaPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {mediaType === "image" ? (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            ) : (
              <video
                src={mediaPreview}
                controls
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            )}
            <button
              onClick={removeMedia}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {sendStatus && (
        <p
          className={`text-sm mb-2 ${
            sendStatus.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {sendStatus.message}
        </p>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
            className="hidden"
            ref={fileInputRef}
            onChange={handleMediaChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              mediaPreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {mediaType === "video" ? <Video size={20} /> : <Image size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={(!text.trim() && !mediaPreview) || sendStatus?.type === "success"}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;