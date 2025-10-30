import React from 'react';

const HowToUsePage = () => {
    const youtubeVideoId = 'dQw4w9WgXcQ'; // Placeholder YouTube video ID

    return (
        // FIX: Removed container, mx-auto, px, and pt classes to fix margins
        <div className="bg-background text-foreground min-h-screen">
            {/* FIX: Applied theme gradient to the main heading */}
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">How To Use HealthSphere</h1>

            <div className="bg-card p-6 rounded-lg shadow-lg mb-8 border border-border">
                <h2 className="text-2xl font-semibold mb-4">Website Tutorial Video</h2>
                <p className="text-muted-foreground mb-4">Watch this video to learn how to navigate and utilize all the features of HealthSphere.</p>
                
                <div className="relative w-full overflow-hidden rounded-lg aspect-video">
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                        title="HealthSphere Tutorial Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* FIX: Applied theme gradient to the link */}
                <p className="text-muted-foreground mt-6">If you have any further questions after watching the tutorial, please refer to our <a href="/patient/settings/faq" className="font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text hover:underline">FAQ section</a> or contact support.</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-4">Key Features Covered:</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Booking Appointments</li>
                    <li>Managing Prescriptions</li>
                    <li>Finding Medicines</li>
                    <li>Accessing Health Records</li>
                    <li>Updating Profile Settings</li>
                </ul>
            </div>
        </div>
    );
};

export default HowToUsePage;
