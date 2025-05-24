import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Sparkles, FileText, Zap } from 'lucide-react';

export default function App() {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [response, setResponse]=useState("");
  


  const handleCheck = () => {
    setIsChecking(true);
    const callNetlifyFunction=async()=>{
      try{
        const result=await fetch('/.netlify/functions/check-grammar',
          {
            method:'POST',
            headers:{
              'Content-Type':'application/json',
            },
            body:JSON.stringify({text:text})
          }
        )

        if (!result.ok){
          const errorData=await result.json()
          throw new Error(errorData.error || `Request failed with status code ${result.status}`)
        }
      
        const {response} =await result.json()
        setResponse(response)
        setHasResults(true)
      }


      catch(error){
        console.error("Error calling netlify function",error)
        setHasResults(false)
      }
      finally{
        setIsChecking(false)
      }
    }

    callNetlifyFunction();
  };

  const handleClear = () => {
    setText('');
    setHasResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-100 to-blue-700 relative overflow-hidden">
     
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-10 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
    
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="glass-card p-3 rounded-2xl mr-4 hover-lift mb-5">
              <Sparkles className="w-8 h-8 text-black " />
            </div>
            <h1 className="text-5xl mb-5 md:text-5xl font-bold text-black font-display">
              Grammar<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-950 to-blue-600">AI</span>
            </h1>
          </div>
          <p className="text-lg text-black text-shadow-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Get instant feedback and suggestions to perfect your text.
          </p>
        </div>

   
        <div className="space-y-8">
       
          <div className="glass-card p-8 rounded-3xl hover-lift">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-black">Your Text</h2>
            </div>
            
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here to check for grammar, spelling, and style improvements..."
                className="w-full h-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-black placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                style={{ fontSize: '16px', lineHeight: '1.6' }}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-900">
                {text.length} characters
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleCheck}
                disabled={!text.trim() || isChecking}
                className="flex-1 bg-gradient-to-r from-blue-900 to-blue-400 text-black font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center space-x-2 button-glow"
              >
                {isChecking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Check Grammar</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleClear}
                disabled={!text}
                className="bg-white/10 backdrop-blur-sm text-black font-semibold py-4 px-8 rounded-2xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Clear
              </button>
            </div>
          </div>

          {hasResults && (
            <div className="glass-card p-8 rounded-3xl hover-lift animate-slide-up">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-xl font-semibold ">Analysis Results</h2>
              </div>

    
              <div className="space-y-4">

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div dangerouslySetInnerHTML={{__html:response}}>
                  
                  </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}