"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wand2, Download, RefreshCw, Aperture, AlertCircle } from "lucide-react";

import { ImageUpload } from "@/components/image-upload";
import { StyleSelector, ANIME_STYLES } from "@/components/style-selector";
import { GenderSelector } from "@/components/gender-selector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateImage } from "@/actions/generate";

export default function Home() {
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = React.useState<string>(ANIME_STYLES[0].id);
  const [gender, setGender] = React.useState<string>("male");
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    const style = ANIME_STYLES.find((s) => s.id === selectedStyle);
    if (!style) return;
    
    setError(null);
    setIsGenerating(true);
    setGeneratedImage(null);

    const result = await generateImage(gender, style.prompt, uploadedImage || undefined);

    if (result.success && result.imageUrl) {
      setGeneratedImage(result.imageUrl);
    } else {
      setError(result.error || "Algo deu errado");
    }

    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `anime-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-white relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-12 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 mb-4">
            <Aperture className="w-6 h-6 text-primary mr-2" />
            <span className="text-sm font-medium tracking-wider uppercase text-primary-foreground">Gerador de Anime com IA</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
            Anime Transformer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforme sua imaginação em arte anime. Escolha o tipo de personagem, selecione o estilo e veja a mágica acontecer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-xs font-bold">1</span>
                <h2 className="text-xl font-semibold">Referência (Opcional)</h2>
              </div>
              <p className="text-sm text-muted-foreground">Use como referência visual enquanto gera.</p>
              <ImageUpload 
                value={uploadedImage} 
                onChange={setUploadedImage} 
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-xs font-bold">2</span>
                <h2 className="text-xl font-semibold">Tipo de Personagem</h2>
              </div>
              <GenderSelector
                value={gender}
                onChange={setGender}
                disabled={isGenerating}
              />
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center text-destructive text-sm bg-destructive/10 p-3 rounded-md"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </motion.div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-xs font-bold">3</span>
                <h2 className="text-xl font-semibold">Escolha o Estilo</h2>
              </div>
              <StyleSelector 
                selectedStyle={selectedStyle} 
                onSelect={setSelectedStyle} 
                disabled={isGenerating}
              />
            </div>

            <Button 
              size="lg" 
              className="w-full text-lg h-14 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Gerar Personagem
                </>
              )}
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7 flex flex-col"
          >
            <Card className="flex-1 min-h-[500px] flex items-center justify-center relative overflow-hidden group">
              {generatedImage ? (
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <img 
                    src={generatedImage} 
                    alt="Personagem Anime Gerado" 
                    className="max-w-full max-h-[700px] rounded-lg shadow-2xl object-contain"
                  />
                  <div className="absolute bottom-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button onClick={handleDownload} className="shadow-lg backdrop-blur-md bg-black/50 hover:bg-black/70 border border-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="text-center space-y-6 p-12">
                   <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary/30 to-purple-600/30 mx-auto flex items-center justify-center mb-6 animate-pulse">
                      <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                   </div>
                   <h3 className="text-2xl font-medium text-foreground">Gerando sua arte...</h3>
                   <p className="max-w-sm mx-auto text-muted-foreground">
                     Isso pode levar alguns segundos
                   </p>
                   <div className="flex justify-center gap-1">
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                     <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                   </div>
                </div>
              ) : (
                <div className="text-center space-y-6 text-muted-foreground p-12">
                   <div className="w-32 h-32 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6">
                      <Wand2 className="w-12 h-12 opacity-50" />
                   </div>
                   <h3 className="text-2xl font-medium text-foreground">Pronto para Criar</h3>
                   <p className="max-w-sm mx-auto">
                     Escolha o tipo de personagem e o estilo para gerar seu personagem anime único.
                   </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-2">
            Desenvolvido com 
            <a href="https://pollinations.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline hover:text-primary/80 transition-colors font-medium">
              pollinations.ai
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
