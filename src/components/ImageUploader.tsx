import { useRef, useState } from 'react';
import { ImagePlus, X, Upload, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 3 }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // 压缩图片函数
  const compressImage = (file: File, maxWidth: number = 1024, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.readAsDataURL(blob);
          } else {
            // 如果压缩失败，使用原图
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.readAsDataURL(file);
          }
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) return;

    const filesToProcess = files.slice(0, remainingSlots);
    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    try {
      const newImages: string[] = [...images];
      const totalFiles = filesToProcess.length;
      
      for (let i = 0; i < totalFiles; i++) {
        const file = filesToProcess[i];
        if (!file.type.startsWith('image/')) continue;
        
        // 检查文件大小
        if (file.size > 5 * 1024 * 1024) {
          // 大于5MB，进行压缩
          const compressedImage = await compressImage(file);
          newImages.push(compressedImage);
        } else {
          // 小于5MB，直接读取
          const reader = new FileReader();
          await new Promise<void>((resolve) => {
            reader.onload = (e) => {
              const result = e.target?.result as string;
              newImages.push(result);
              resolve();
            };
            reader.readAsDataURL(file);
          });
        }
        
        // 更新上传进度
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }
      
      onChange(newImages);
      setUploadSuccess(true);
      
      // 3秒后清除成功提示
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  return (
    <div className="space-y-4">
      {/* 上传成功提示 */}
      {uploadSuccess && (
        <div className="flex items-center gap-2 p-3 bg-[#e8f5e8] border border-[#c8e6c9] rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-[#4caf50]" />
          <p className="text-sm text-[#2e7d32]">上传成功！</p>
        </div>
      )}

      {/* 上传进度条 */}
      {uploading && (
        <div className="space-y-2">
          <div className="h-2 bg-[#e0d6f0] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#c8b6e2] transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-[#8a7ab5]">上传中... {uploadProgress}%</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {images.map((src, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
            <img src={src} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            disabled={uploading}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all",
              uploading 
                ? "border-[#e0d6f0] bg-[#f5f3f7] cursor-not-allowed"
                : isDragging 
                  ? "border-[#c8b6e2] bg-[#f5f3f7]" 
                  : "border-[#e0d6f0] hover:border-[#c8b6e2] hover:bg-[#f5f3f7]/50"
            )}
          >
            <ImagePlus className="w-8 h-8 text-[#a093c2]" />
            <span className="text-xs text-[#a093c2]">添加图片</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
      
      <p className="text-xs text-[#a093c2]">
        最多上传 {maxImages} 张图片，单张不超过 5MB
      </p>
    </div>
  );
}
