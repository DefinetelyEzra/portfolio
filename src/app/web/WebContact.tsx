'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Calendar, Send, CheckCircle } from 'lucide-react';
import { FaBriefcase, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useDesktopStore } from '@/store/desktopStore';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
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
    priority: 'medium',
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
          setForm({
            name: '',
            email: '',
            subject: '',
            message: '',
            priority: 'medium',
          });
        }, 5000);
      }
    } catch (err) {
      console.error('Error sending message', err);
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
      <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Get In Touch
      </h2>
      <div className="w-20 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
      <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        Lets discuss opportunities, collaborations, or just say hello.
      </p>
    </div>
  );
}

/* CONTACT INFO */
function ContactInfo({ isDark, isInView }: { readonly isDark: boolean; readonly isInView: boolean }) {
  const contactInfo = [
    { id: 'email', icon: Mail, label: 'Email', value: 'ezraagun@gmail.com', href: 'mailto:ezraagun@gmail.com' },
    { id: 'phone', icon: Phone, label: 'Phone', value: '+234 708 229 7108', href: 'tel:+2347082297108' },
    { id: 'location', icon: MapPin, label: 'Location', value: 'Lagos, Nigeria', href: null },
    { id: 'availability', icon: Calendar, label: 'Availability', value: 'Available for opportunities', href: null },
  ];

  const socialLinks = [
    { id: 'github', icon: FaGithub, label: 'GitHub', url: 'https://github.com/DefinetelyEzra' },
    { id: 'linkedin', icon: FaLinkedinIn, label: 'LinkedIn', url: 'https://linkedin.com/in/odunayo-agunbiade-155440315' },
    { id: 'jobberman', icon: FaBriefcase, label: 'Jobberman', url: 'https://jobberman.com/profile/Odunayo-Agunbiade' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {contactInfo.map((info) => {
        const IconComponent = info.icon;
        return (
          <div
            key={info.id}
            className={`p-6 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <IconComponent className={isDark ? 'text-gray-300' : 'text-gray-700'} />
              </div>

              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{info.label}</p>

                {info.href ? (
                  <a
                    href={info.href}
                    className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} hover:underline`}
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {info.value}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div
        className={`p-6 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Connect With Me
        </h3>

        <div className="space-y-3">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-3 p-3 rounded-lg border transition ${isDark
                ? 'border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <social.icon className="w-5 h-5" />
              <span className="font-medium">{social.label}</span>
            </a>
          ))}
        </div>
      </div>
    </motion.div>
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
  readonly handleSubmit: (e: React.FormEvent) => Promise<void>;
  readonly isSubmitting: boolean;
  readonly submitted: boolean;
  readonly isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`p-8 rounded-xl border shadow ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
    >
      {submitted && (
        <div className="flex items-center space-x-3 p-4 mb-6 rounded-lg bg-green-100 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span>Message sent successfully</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Your Name"
          name="name"
          value={form.name}
          onChange={setForm}
          required
          isDark={isDark}
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={setForm}
          required
          isDark={isDark}
        />

        <Input
          label="Subject"
          name="subject"
          value={form.subject}
          onChange={setForm}
          required
          isDark={isDark}
        />

        <PrioritySelect form={form} setForm={setForm} isDark={isDark} />

        <Textarea
          label="Message"
          name="message"
          value={form.message}
          onChange={setForm}
          required
          isDark={isDark}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition ${isSubmitting
            ? 'bg-blue-400 text-white cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

/* INPUT COMPONENT */
function Input({
  label,
  name,
  value,
  onChange,
  isDark,
  type = 'text',
  required,
}: {
  readonly label: string;
  readonly name: keyof FormState;
  readonly value: string;
  readonly onChange: React.Dispatch<React.SetStateAction<FormState>>;
  readonly isDark: boolean;
  readonly type?: string;
  readonly required?: boolean;
}) {
  const inputId = `${name}-input`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange((prev) => ({ ...prev, [name]: e.target.value }))}
        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 ${isDark
          ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
          : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
          }`}
      />
    </div>
  );
}

/* TEXTAREA */
function Textarea({
  label,
  name,
  value,
  onChange,
  isDark,
  required,
}: {
  readonly label: string;
  readonly name: keyof FormState;
  readonly value: string;
  readonly onChange: React.Dispatch<React.SetStateAction<FormState>>;
  readonly isDark: boolean;
  readonly required?: boolean;
}) {
  const textareaId = `${name}-textarea`;

  return (
    <div>
      <label
        htmlFor={textareaId}
        className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange((prev) => ({ ...prev, [name]: e.target.value }))}
        rows={6}
        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 ${isDark
          ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
          : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
          }`}
      />
    </div>
  );
}

/* PRIORITY SELECT */
function PrioritySelect({
  form,
  setForm,
  isDark,
}: {
  readonly form: FormState;
  readonly setForm: React.Dispatch<React.SetStateAction<FormState>>;
  readonly isDark: boolean;
}) {
  const selectId = 'priority-select';

  return (
    <div>
      <label
        htmlFor={selectId}
        className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
      >
        Priority
      </label>
      <select
        id={selectId}
        name="priority"
        value={form.priority}
        onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as FormState['priority'] }))}
        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 ${isDark
          ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
          : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
          }`}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
    </div>
  );
}