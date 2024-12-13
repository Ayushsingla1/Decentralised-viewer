import { X, Upload } from "lucide-react"

const FileUploadField = ({ label, onChange, preview, onRemove, accept, type }: any) => {
    console.log(label)
    return (
        <div className="flex flex-col gap-y-2 w-80">
            <label className="text-white">{label}</label>
            <div className="relative">
                <div className="relative border-2 border-dashed border-gray-400 rounded-lg p-4 
                               hover:border-[#1EFF00] transition-colors group">
                    <input
                        type="file"
                        onChange={onChange}
                        accept={accept}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-y-2">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#1EFF00] transition-colors" />
                        <p className="text-sm text-gray-400 text-center">
                            {preview ? 'Change file' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {type === 'image' ? 'PNG, JPG up to 10MB' : 'MP4, WebM up to 2GB'}
                        </p>
                    </div>
                </div>

                {/* Preview Area */}
                {preview && (
                    <div className="mt-3 relative group">
                        {/* Remove Button */}
                        <button
                            onClick={onRemove}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 
                                     shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
                                     hover:bg-red-600 z-20"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>

                        {/* Preview Content */}
                        {type === 'image' ? (
                            <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                                <video
                                    src={preview}
                                    controls
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        {/* File Info Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 
                                      group-hover:opacity-100 transition-opacity rounded-lg
                                      flex items-center justify-center">
                            <p className="text-white text-sm">Click to change file</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FileUploadField;