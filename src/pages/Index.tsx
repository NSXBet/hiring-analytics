import { Loader2 } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 opacity-75 duration-1000"></div>
          <div className="relative rounded-full bg-primary/10 p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your app is being built
          </h1>
          <p className="text-lg text-muted-foreground">
            Sua app está sendo construída
          </p>
        </div>

        <div className="mt-8 flex gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
