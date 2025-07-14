import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  Video, 
  Camera, 
  Mic, 
  Monitor, 
  Upload, 
  Share2, 
  Play, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  Clock,
  Shield
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Screen Recording",
      description: "Capture your entire screen or specific application windows with crystal clear quality."
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Webcam Integration",
      description: "Add your face to recordings with picture-in-picture webcam overlay for personal touch."
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Audio Capture",
      description: "Record system audio and microphone simultaneously for complete walkthroughs."
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Cloud Storage",
      description: "Automatically upload recordings to secure cloud storage with Firebase integration."
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Instant Sharing",
      description: "Generate shareable links immediately after recording for quick collaboration."
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: "Universal Playback",
      description: "Videos play on any device with standard HTML5 player controls."
    }
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Perfect for Teams",
      description: "Share knowledge, onboard new members, and collaborate effectively"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Save Time",
      description: "Record once, share multiple times instead of repeating explanations"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your recordings are stored securely with controlled access"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Start Recording",
      description: "Click record and grant permissions for screen, camera, and microphone access."
    },
    {
      number: "02",
      title: "Create Content",
      description: "Record your screen while your webcam appears as an overlay. Speak naturally."
    },
    {
      number: "03",
      title: "Upload & Share",
      description: "Your video automatically uploads to the cloud and generates a shareable link."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Rekordr</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <Link
                to="/record"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-6 text-sm sm:text-base rounded-lg font-medium transition-colors"
              >
                <span className="hidden sm:inline">Start Recording</span>
                <span className="sm:hidden">Record</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-950 dark:to-purple-950/20 py-20 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight animate-fade-in">
              Record. Upload. Share.
              <span className="text-blue-600 block">Instantly.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed animate-slide-up px-4">
              Create professional video walkthroughs with screen recording, webcam overlay, 
              and audio capture. Perfect for tutorials, demos, and team collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Link
                to="/record"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Recording Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-dark-950 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Video Walkthroughs
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Powerful recording features combined with seamless sharing capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-dark-900 rounded-xl p-6 sm:p-8 hover:bg-gray-100 dark:hover:bg-dark-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-900 dark:to-blue-950/20 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
              Three simple steps to create and share your video walkthrough
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white text-xl sm:text-2xl font-bold w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 px-4">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white dark:bg-dark-950 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Why Choose Rekordr?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
                Built for modern teams who need to communicate effectively through video.
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-blue-600 mt-1">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-4 sm:p-8 transition-colors duration-300 mt-8 lg:mt-0">
              <div className="bg-white dark:bg-dark-900 rounded-lg p-4 sm:p-6 shadow-lg transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-dark-700 rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2"></div>
                  <div className="h-24 sm:h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg flex items-center justify-center">
                    <Play className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
                  </div>
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technical Excellence
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
              Built with modern web technologies for reliability and performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-white dark:bg-dark-800 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Browser Native</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Uses MediaRecorder API for optimal performance</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-dark-800 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Supabase Storage</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Secure cloud storage for reliable uploads</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-dark-800 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Real-time Preview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Live webcam feed during recording</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-dark-800 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">Universal Playback</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Works on all modern browsers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-4">
              Ready to Create Your First Video Walkthrough?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-6 sm:mb-8 px-4">
              Start recording in seconds. No downloads, no setup required.
            </p>
            <Link
              to="/record"
              className="bg-white hover:bg-gray-100 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 inline-flex items-center space-x-2 hover:scale-105 shadow-lg"
            >
              <span>Start Recording Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-dark-950 text-white py-12 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Video className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                <span className="text-xl sm:text-2xl font-bold text-white">Rekordr</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400 dark:text-gray-300 mb-4 max-w-md">
                The easiest way to create and share video walkthroughs. 
                Record your screen, webcam, and audio simultaneously.
              </p>
              <div className="flex space-x-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-300">
                <li>Screen Recording</li>
                <li>Webcam Integration</li>
                <li>Audio Capture</li>
                <li>Supabase Storage</li>
                <li>Instant Sharing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-300">
                <li>Documentation</li>
                <li>Browser Support</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 dark:border-dark-700 mt-8 pt-8 text-center text-sm text-gray-400 dark:text-gray-300">
            <p>&copy; 2025 Rekordr. Built with modern web technologies for seamless video recording.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};