import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
  FiCamera,
  FiShield,
  FiUsers,
  FiFileText,
  FiTrendingUp,
  FiLock,
  FiEye,
  FiVideo,
  FiCpu,
  FiArrowRight
} from 'react-icons/fi';

const LandingPage = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern - Fixed template literal */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        {/* Animated Scan Line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-1 bg-primary-500/30 blur-xl animate-scan"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block p-2 px-4 rounded-full bg-primary-500/10 border border-primary-500/30 mb-8">
              <span className="text-primary-400 text-sm font-medium">
                🚀 Next-Gen Security System
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              CCTV Face Recognition
              <span className="block text-primary-500 mt-2">For Maximum Security</span>
            </h1>

            <p className="text-xl text-secondary-400 max-w-3xl mx-auto mb-12">
              Advanced AI-powered face recognition system for real-time thief detection 
              and security monitoring. Protect your premises with cutting-edge technology.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="group px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Access Control Room</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a
                href="#features"
                className="px-8 py-4 bg-secondary-800 hover:bg-secondary-700 text-white font-semibold rounded-lg border border-secondary-700 transition-all duration-300"
              >
                Explore Features
              </a>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20"
            >
              {[
                { value: '99.9%', label: 'Accuracy Rate', icon: FiTrendingUp },
                { value: '< 1s', label: 'Processing Time', icon: FiCpu },
                { value: '24/7', label: 'Monitoring', icon: FiEye }
              ].map((stat, index) => (
                <div key={index} className="glass-card p-6">
                  <stat.icon className="text-primary-500 text-3xl mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-secondary-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary-800/50" ref={ref}>
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white mb-4">
              Advanced Security Features
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-secondary-400 max-w-2xl mx-auto">
              Powered by state-of-the-art AI and computer vision technology
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: FiCamera,
                title: 'Real-time Recognition',
                description: 'Instant face detection and matching from live CCTV feeds'
              },
              {
                icon: FiShield,
                title: 'High Security',
                description: 'Bank-level encryption and secure data storage'
              },
              {
                icon: FiUsers,
                title: 'Database Management',
                description: 'Easily manage suspects and persons of interest'
              },
              {
                icon: FiVideo,
                title: 'Video Processing',
                description: 'Process recorded footage with frame-by-frame analysis'
              },
              {
                icon: FiFileText,
                title: 'Automated Reports',
                description: 'Generate detailed PDF reports for evidence'
              },
              {
                icon: FiLock,
                title: 'Multi-level Access',
                description: 'Role-based access control for security personnel'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-card p-8 hover:border-primary-500/50 transition-all duration-300 group"
              >
                <feature.icon className="text-4xl text-primary-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-secondary-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                How It <span className="text-primary-500">Works</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    step: '01',
                    title: 'Upload Media',
                    description: 'Upload images or video footage from your CCTV system'
                  },
                  {
                    step: '02',
                    title: 'Face Detection',
                    description: 'AI-powered algorithms detect and extract faces from the media'
                  },
                  {
                    step: '03',
                    title: 'Database Matching',
                    description: 'Faces are compared against your database of known individuals'
                  },
                  {
                    step: '04',
                    title: 'Instant Alert',
                    description: 'Immediate notification when a match is found'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center font-bold text-white">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-secondary-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card p-8 relative z-10">
                <div className="aspect-video bg-secondary-900 rounded-lg border border-secondary-700 flex items-center justify-center">
                  <div className="text-center">
                    <FiCamera className="text-6xl text-primary-500 mx-auto mb-4" />
                    <p className="text-secondary-400">System Preview</p>
                  </div>
                </div>
                
                {/* Scanning Effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary-500/50 animate-scan"></div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-600/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-600/20 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Secure Your Premises?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join leading security agencies using our advanced face recognition system
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Access Control Room
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 border-t border-secondary-800 py-8">
        <div className="container mx-auto px-6 text-center text-secondary-400">
          <p>&copy; 2026 CCTV Face Recognition System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;