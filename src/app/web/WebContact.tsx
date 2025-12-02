'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Send, CheckCircle } from 'lucide-react';
import { FaBriefcase, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function WebContact() {
  const { currentTheme } = useDesktopStore();
  const isDark = currentTheme === 'dark';

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setForm({ name: '', email: '', subject: '', message: '' });
        }, 5000);
      }
    } catch (error) {
      console.error('Error sending message', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={ref}
      className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Header isDark={isDark} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactInfo isDark={isDark} isInView={isInView} />

            <ContactForm
              isDark={isDark}
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitted={submitted}
              isInView={isInView}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* HEADER */
function Header({ isDark }: { readonly isDark: boolean }) {
  return (
    <div className="text-center mb-16">
      <h2
        className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
          }`}
      >
        Get In Touch
      </h2>

      <div className="w-20 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mb-6" />

      <p
        className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
      >
        {"Let's discuss opportunities, collaborations, or just say hello!"}
      </p>
    </div>
  );
}

/* CONTACT INFO */
function ContactInfo({
  isDark,
  isInView,
}: {
  readonly isDark: boolean;
  readonly isInView: boolean;
}) {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'ezraagun@gmail.com',
      href: 'mailto:ezraagun@gmail.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+234 708 229 7108',
      href: 'tel:+2347082297108',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Lagos, Nigeria',
      href: null,
    },
    {
      icon: Calendar,
      label: 'Availability',
      value: 'Available for opportunities',
      href: null,
    },
  ];

  const socialLinks = [
    { icon: FaGithub, label: 'GitHub', url: 'https://github.com/DefinetelyEzra' },
    { icon: FaLinkedinIn, label: 'LinkedIn', url: 'https://linkedin.com/in/odunayo-agunbiade-155440315' },
    { icon: FaBriefcase, label: 'Jobberman', url: 'https://jobberman.com/profile/Odunayo-Agunbiade' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="space-y-6"
    >
      {contactInfo.map((info, index) => (
        <motion.div
          key={info.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 + index * 0.1 }}
          className={`p-6 rounded-xl ${isDark
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
            }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}
            >
              <info.icon
                className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}
              />
            </div>

            <div>
              <h3
                className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}
              >
                {info.label}
              </h3>

              {info.href ? (
                <a
                  href={info.href}
                  className={`${isDark
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-700'
                    }`}
                >
                  {info.value}
                </a>
              ) : (
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {info.value}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
        className={`p-6 rounded-xl ${isDark
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
          }`}
      >
        <h3
          className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
            }`}
        >
          Connect With Me
        </h3>

        <div className="flex gap-4">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-lg transition-colors ${isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                title={social.label}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* FORM SUB COMPONENTS */
function InputField({
  id,
  label,
  value,
  onChange,
  isDark,
  placeholder,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly placeholder: string;
  readonly isDark: boolean;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
      >
        {label}
      </label>

      <input
        id={id}
        type="text"
        required
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
            ? 'bg-gray-700 border-gray-600 text-gray-100'
            : 'bg-white border-gray-300 text-gray-900'
          }`}
        placeholder={placeholder}
      />
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  isDark,
  placeholder,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly placeholder: string;
  readonly isDark: boolean;
  readonly onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
      >
        {label}
      </label>

      <textarea
        id={id}
        required
        rows={6}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
            ? 'bg-gray-700 border-gray-600 text-gray-100'
            : 'bg-white border-gray-300 text-gray-900'
          }`}
        placeholder={placeholder}
      />
    </div>
  );
}

/* CONTACT FORM */
function ContactForm({
  isDark,
  form,
  setForm,
  handleSubmit,
  isSubmitting,
  submitted,
  isInView,
}: {
  readonly isDark: boolean;
  readonly form: FormState;
  readonly setForm: React.Dispatch<React.SetStateAction<FormState>>;
  readonly handleSubmit: (e: React.FormEvent) => void;
  readonly isSubmitting: boolean;
  readonly submitted: boolean;
  readonly isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={`p-8 rounded-2xl ${isDark
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
        }`}
    >
      {submitted ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />

          <h3
            className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
              }`}
          >
            Message Sent!
          </h3>

          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            I’ll get back to you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          <InputField
            id="contact-name"
            label="Your Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            isDark={isDark}
            placeholder="John Doe"
          />

          <InputField
            id="contact-email"
            label="Email Address *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            isDark={isDark}
            placeholder="john@example.com"
          />

          <InputField
            id="contact-subject"
            label="Subject *"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            isDark={isDark}
            placeholder="What’s this about?"
          />

          <TextAreaField
            id="contact-message"
            label="Message *"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            isDark={isDark}
            placeholder="Tell me about your project or opportunity..."
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}