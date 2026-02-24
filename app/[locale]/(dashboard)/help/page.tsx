"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EnterprisePageHeader } from "@/components/shared/EnterprisePageHeader";
import {
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Search,
  ChevronDown,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    category: "Getting Started",
    question: "How do I log in to the system?",
    answer: "Use your email and password provided by your administrator. If you forgot your password, click 'Forgot Password' on the login page.",
  },
  {
    id: "2",
    category: "Getting Started",
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' on the login page, enter your email, and follow the instructions sent to your email address.",
  },
  {
    id: "3",
    category: "Patient Management",
    question: "How do I add a new patient?",
    answer: "Navigate to Patients > Add New Patient, fill in the required information, and click Save. You need appropriate permissions to add patients.",
  },
  {
    id: "4",
    category: "Patient Management",
    question: "How do I view patient medical history?",
    answer: "Go to Patients, select a patient, and click on 'Medical Records' to view their complete history including visits, prescriptions, and lab results.",
  },
  {
    id: "5",
    category: "Appointments",
    question: "How do I schedule an appointment?",
    answer: "Navigate to Appointments > Schedule New, select the patient and doctor, choose date/time, and confirm. The system will send notifications to both parties.",
  },
  {
    id: "6",
    category: "Appointments",
    question: "Can I reschedule an appointment?",
    answer: "Yes, go to Appointments, find the appointment, click Edit, change the date/time, and save. Notifications will be sent automatically.",
  },
  {
    id: "7",
    category: "Prescriptions",
    question: "How do I create a prescription?",
    answer: "During a patient visit, click 'Add Prescription', enter medication details, dosage, and frequency. The prescription will be available for the patient to view.",
  },
  {
    id: "8",
    category: "Technical",
    question: "What browsers are supported?",
    answer: "The system works best on Chrome, Firefox, Safari, and Edge. Please ensure you have JavaScript enabled.",
  },
];

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    contact: "support@healthcare.com",
    action: "Send Email",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call our support team",
    contact: "+1 (555) 123-4567",
    action: "Call Now",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with support agent",
    contact: "Available 9 AM - 6 PM EST",
    action: "Start Chat",
  },
];

const resources = [
  {
    title: "User Guide",
    description: "Complete documentation for all features",
    icon: FileText,
    link: "#",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    icon: FileText,
    link: "#",
  },
  {
    title: "API Documentation",
    description: "For developers integrating with the system",
    icon: FileText,
    link: "#",
  },
  {
    title: "System Status",
    description: "Check system health and uptime",
    icon: FileText,
    link: "#",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent successfully! We'll get back to you soon.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <EnterprisePageHeader
        title="Help & Support"
        description="Find answers and get support for your questions"
        icon={HelpCircle}
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card key={method.title} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                    <p className="text-sm font-medium mt-2">{method.contact}</p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      {method.action}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQs */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full text-left"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-base">{faq.question}</CardTitle>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                          expandedFAQ === faq.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </button>
                {expandedFAQ === faq.id && (
                  <CardContent className="pt-0 pb-4">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No FAQs found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Resources & Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Card key={resource.title} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">{resource.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                  <Button variant="ghost" size="sm" className="mt-3 w-full justify-start">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <CardDescription>Can't find what you're looking for? Send us a message and we'll help you out.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="What is this about?"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Describe your issue or question..."
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full md:w-auto">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
