import React, { useState, useEffect } from 'react';

const Loader = () => {
    const [growthStage, setGrowthStage] = useState(0);
    const stages = [
        '🌱', 
        '🌿', 
        '🌾',  
        '🌻', 
        '🚜',  
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setGrowthStage((prev) => (prev + 1) % stages.length);
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center justify-center z-50 p-4">
            <div className="text-center">
                <div className="text-8xl mb-4 animate-bounce">
                    {stages[growthStage]}
                </div>
                <div className="relative w-64 h-2 bg-green-200 rounded-full overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-500"
                        style={{ width: `${((growthStage + 1) / stages.length) * 100}%` }}
                    ></div>
                </div>
                <p className="mt-4 text-2xl text-green-800 font-bold animate-pulse">
                Fresh from the Farm, Straight to You...
                </p>
            </div>
        </div>
    );
};

export default Loader;
