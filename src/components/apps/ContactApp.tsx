'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { FaGithub, FaLinkedin, FaBriefcase } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

// Extract theme-based style utilities
const getThemeStyles = (currentTheme: string) => {
  const isDark = currentTheme === 'dark';

  const darkTheme = {
    background: 'from-gray-900 via-gray-800 to-gray-700',
    cardBackground: 'bg-gray-800 border-gray-700',
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-400',
      muted: 'text-gray-500',
    },
    headerBorder: 'border-gray-700',
    tabContainer: 'bg-gray-700',
    tabActive: 'bg-gray-800 text-gray-100 shadow-sm',
    tabInactive: 'text-gray-400 hover:text-gray-200',
    input: 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-transparent',
    label: 'text-gray-300',
    successAlert: 'bg-green-900/50 border-green-700',
    successText: {
      primary: 'text-green-300',
      secondary: 'text-green-400',
    },
    quickTopicActive: 'bg-blue-600 text-white border-blue-600',
    quickTopicInactive: 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600',
    contactInfo: {
      email: { bg: 'bg-red-900/20', iconBg: 'bg-gray-700', color: 'text-red-400' },
      phone: { bg: 'bg-green-900/20', iconBg: 'bg-gray-700', color: 'text-green-400' },
      location: { bg: 'bg-blue-900/20', iconBg: 'bg-gray-700', color: 'text-blue-400' },
      availability: { bg: 'bg-purple-900/20', iconBg: 'bg-gray-700', color: 'text-purple-400' },
    },
    socialLinks: {
      github: { text: 'text-gray-300', hover: 'hover:bg-gray-700 hover:text-white' },
      linkedin: { text: 'text-blue-400', hover: 'hover:bg-blue-700 hover:text-white' },
      jobberman: { text: 'text-orange-400', hover: 'hover:bg-orange-700 hover:text-white' },
    },
    responseInfo: 'from-blue-900/20 to-indigo-900/20 border-blue-800',
    responseIcon: 'bg-blue-600',
  };

  const lightTheme = {
    background: 'from-blue-50 via-white to-indigo-50',
    cardBackground: 'bg-white border-gray-200',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
    },
    headerBorder: 'border-gray-200',
    tabContainer: 'bg-gray-100',
    tabActive: 'bg-white text-gray-900 shadow-sm',
    tabInactive: 'text-gray-600 hover:text-gray-900',
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-transparent',
    label: 'text-gray-700',
    successAlert: 'bg-green-50 border-green-200',
    successText: {
      primary: 'text-green-800',
      secondary: 'text-green-600',
    },
    quickTopicActive: 'bg-blue-500 text-white border-blue-500',
    quickTopicInactive: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
    contactInfo: {
      email: { bg: 'bg-red-50', iconBg: 'bg-white', color: 'text-red-600' },
      phone: { bg: 'bg-green-50', iconBg: 'bg-white', color: 'text-green-600' },
      location: { bg: 'bg-blue-50', iconBg: 'bg-white', color: 'text-blue-600' },
      availability: { bg: 'bg-purple-50', iconBg: 'bg-white', color: 'text-purple-600' },
    },
    socialLinks: {
      github: { text: 'text-gray-700', hover: 'hover:bg-gray-900 hover:text-white' },
      linkedin: { text: 'text-blue-600', hover: 'hover:bg-blue-600 hover:text-white' },
      jobberman: { text: 'text-orange-600', hover: 'hover:bg-orange-600 hover:text-white' },
    },
    responseInfo: 'from-blue-50 to-indigo-50 border-blue-100',
    responseIcon: 'bg-blue-500',
  };

  return isDark ? darkTheme : lightTheme;
};

export default function ContactApp() {
  const { currentTheme } = useDesktopStore();
  const styles = getThemeStyles(currentTheme);

  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'info'>('form');

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'ezraagun@gmail.com',
      href: 'mailto:ezraagun@gmail.com',
      type: 'email' as const
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+234 708 229 7108',
      href: 'tel:+2347082297108',
      type: 'phone' as const
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Awoyaya, Lekki-Epe Expressway, Lagos',
      href: null,
      type: 'location' as const
    },
    {
      icon: Calendar,
      label: 'Availability',
      value: 'Available for opportunities',
      href: null,
      type: 'availability' as const
    }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/DefinetelyEzra',
      type: 'github' as const
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'www.linkedin.com/in/odunayo-agunbiade-155440315',
      type: 'linkedin' as const
    },
    {
      name: 'Jobberman',
      icon: FaBriefcase,
      url: 'https://jobberman.com/profile/Odunayo-Agunbiade',
      type: 'jobberman' as const
    }
  ];

  const quickTopics = [
    'AI/ML Project Collaboration',
    'VR Development Opportunities',
    'Fullstack Development Work',
    'Teaching/Mentorship Role',
    'Open Source Contribution',
    'Research Collaboration',
    'General Inquiry'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickTopic = (topic: string) => {
    setForm(prev => ({ ...prev, subject: topic }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
          setForm({
            name: '',
            email: '',
            subject: '',
            message: '',
            priority: 'medium'
          });
        }, 5000); 
      } else {
        // Handle error
        alert(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const baseColors = {
      high: currentTheme === 'dark' ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
      medium: currentTheme === 'dark' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      low: currentTheme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
    };

    return baseColors[priority as keyof typeof baseColors] || (currentTheme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800');
  };

  return (
    <div className={`h-full flex flex-col bg-gradient-to-br ${styles.background}`}>
      {/* Header */}
      <div className={`p-6 border-b ${styles.headerBorder}`}>
        <h1 className={`text-2xl font-bold ${styles.text.primary} mb-2`}>Get In Touch</h1>
        <p className={`${styles.text.secondary} mb-4`}>Let&apos;s discuss opportunities, collaborations, or just say hello!</p>

        {/* Tab Navigation */}
        <div className={`flex space-x-1 ${styles.tabContainer} rounded-lg p-1`}>
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'form' ? styles.tabActive : styles.tabInactive
              }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Send Message
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'info' ? styles.tabActive : styles.tabInactive
              }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Contact Info
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'form' ? (
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 ${styles.successAlert} border rounded-lg flex items-center space-x-3`}
              >
                <CheckCircle className={`w-5 h-5 ${styles.successText.primary} flex-shrink-0`} />
                <div>
                  <p className={`${styles.successText.primary} font-medium`}>Message sent successfully!</p>
                  <p className={`${styles.successText.secondary} text-sm`}>I&apos;ll get back to you within 24 hours.</p>
                </div>
              </motion.div>
            )}

            {/* Quick Topics */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${styles.text.primary} mb-3`}>Quick Topics</h3>
              <div className="flex flex-wrap gap-2">
                {quickTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleQuickTopic(topic)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${form.subject === topic ? styles.quickTopicActive : styles.quickTopicInactive
                      }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${styles.cardBackground} rounded-xl shadow-sm border p-6`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium ${styles.label} mb-1`}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${styles.input}`}
                      placeholder="Jardani Jovonovich"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${styles.label} mb-1`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${styles.input}`}
                      placeholder="jardani@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="subject" className={`block text-sm font-medium ${styles.label} mb-1`}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${styles.input}`}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="priority" className={`block text-sm font-medium ${styles.label} mb-1`}>
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={form.priority}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${styles.input}`}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getPriorityColor(form.priority)}`}>
                      {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium ${styles.label} mb-1`}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${styles.input}`}
                    placeholder="Tell me about your project, opportunity, or just say hello..."
                  />
                  <div className={`text-right text-sm ${styles.text.muted} mt-1`}>
                    {form.message.length} characters
                  </div>
                </div>

                {/* Extracted button class logic */}
                {(() => {
                  let btnClass;
                  if (submitted) {
                    btnClass = 'bg-green-500 text-white cursor-default';
                  } else if (isSubmitting) {
                    btnClass = 'bg-blue-400 text-white cursor-not-allowed';
                  } else {
                    btnClass = 'bg-blue-500 text-white hover:bg-blue-600';
                  }

                  let btnContent;
                  if (submitted) {
                    btnContent = (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Message Sent!</span>
                      </>
                    );
                  } else if (isSubmitting) {
                    btnContent = (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    );
                  } else {
                    btnContent = (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    );
                  }

                  return (
                    <button
                      type="submit"
                      disabled={isSubmitting || submitted}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${btnClass}`}
                    >
                      {btnContent}
                    </button>
                  );
                })()}
              </form>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                const infoStyles = styles.contactInfo[info.type];
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`${infoStyles.bg} rounded-xl p-6 border border-gray-100`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${infoStyles.iconBg} shadow-sm`}>
                        <IconComponent className={`w-6 h-6 ${infoStyles.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${styles.text.primary} mb-1`}>{info.label}</h3>
                        {info.href ? (
                          <a
                            href={info.href}
                            className={`${infoStyles.color} hover:underline block`}
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className={styles.text.secondary}>{info.value}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className={`${styles.cardBackground} rounded-xl shadow-sm border p-6 mb-6`}
            >
              <h3 className={`text-lg font-semibold ${styles.text.primary} mb-4`}>Connect With Me</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  const socialStyles = styles.socialLinks[social.type];
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border ${styles.cardBackground.includes('gray-800') ? 'border-gray-600' : 'border-gray-200'} ${socialStyles.text} transition-colors ${socialStyles.hover}`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Response Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className={`bg-gradient-to-r ${styles.responseInfo} rounded-xl p-6 border`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 ${styles.responseIcon} rounded-lg`}>
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${styles.text.primary} mb-2`}>Response Time</h3>
                  <p className={`${styles.text.secondary} mb-4`}>
                    I typically respond to messages within 24 hours during weekdays. For urgent matters,
                    feel free to call or mention &lsquo;urgent&rsquo; in your subject line.
                  </p>
                  <div className={`space-y-2 text-sm ${styles.text.secondary}`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Project collaborations: Same day</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>General inquiries: Within 24 hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Teaching/Mentorship: Within 48 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}