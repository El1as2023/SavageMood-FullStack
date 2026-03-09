import Link from 'next/link';
import { Shield, Loader2, AlertCircle, ArrowLeft, Swords, Upload, X, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CreateTeamFormProps {
    name: string;
    setName: (value: string) => void;

    // Оновлені пропси для файлу замість простого рядка URL
    selectedFile: File | null;
    previewUrl: string | null;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveFile: () => void;

    isLoading: boolean;
    error: string | null;
    onSubmit: (e: React.FormEvent) => void;
}

const CreateTeamForm = ({
                            name, setName,
                            selectedFile, previewUrl, handleFileSelect, handleRemoveFile,
                            isLoading, error, onSubmit
                        }: CreateTeamFormProps) => {
    return (
        <div className="w-full max-w-md relative z-10">
            <Link href="/profile" className="inline-flex items-center text-gray-500 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                Back to Profile
            </Link>

            <div className="bg-[#141f1f] rounded-3xl p-8 border border-white/5 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 rounded-2xl bg-[#7777f6]/10 text-[#7777f6] mb-4 border border-[#7777f6]/20">
                        <Swords size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white font-orbitron">ASSEMBLE SQUAD</h1>
                    <p className="text-gray-400 mt-2 text-sm">Create your legacy.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <div className="flex justify-between items-end mb-2 ml-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Team Name *</label>
                            <span className={`text-[10px] ${name.length > 0 && name.length < 3 ? 'text-red-500' : 'text-gray-600'}`}>
                                {name.length}/50
                            </span>
                        </div>
                        <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. SAVAGE KINGS"
                                className="w-full bg-[#0f1418] border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white focus:border-[#7777f6]/50 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* --- НОВИЙ БЛОК: ЗАВАНТАЖЕННЯ ЛОГО --- */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">
                            Team Logo
                        </label>

                        {!previewUrl ? (
                            // Варіант 1: Файл ще не вибрано
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="w-full h-32 bg-[#0f1418] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-500 group-hover:border-[#7777f6]/50 group-hover:text-[#7777f6] transition-all">
                                    <div className="p-3 rounded-full bg-white/5 mb-2 group-hover:bg-[#7777f6]/10">
                                        <Upload size={20} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wide">Click to upload logo</span>
                                    <span className="text-[10px] opacity-50 mt-1">PNG, JPG up to 5MB</span>
                                </div>
                            </div>
                        ) : (
                            // Варіант 2: Файл вибрано (Прев'ю)
                            <div className="relative w-full h-32 bg-[#0f1418] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden group">
                                <img src={previewUrl} alt="Preview" className="h-full object-contain" />

                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors backdrop-blur-sm z-20"
                                >
                                    <X size={16} />
                                </button>

                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded border border-green-500/20 flex items-center gap-1 backdrop-blur-md">
                                    <ImageIcon size={10} />
                                    Image Selected
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-3 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                            <AlertCircle size={18} />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isLoading || name.length < 3}
                        className="w-full py-4 text-base font-bold tracking-widest uppercase shadow-lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={20} /> Creating...
                            </div>
                        ) : "Initialize Squad"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateTeamForm;