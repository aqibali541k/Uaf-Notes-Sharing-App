import React from "react";
import { Link } from "react-router-dom";
import Seo from "../../../components/Seo";
import { SITE_URL } from "../../../constants";

const FAQ_TITLE = "UAF Notes Sharing App - Frequently Asked Questions";
const FAQ_DESCRIPTION =
  "Answers to common questions about UAF Notes Sharing App: accounts and AG numbers, note privacy, file types, downloads and who can see your notes.";

/* Answers are plain text on purpose: the same text is rendered on the
 * page and used in the FAQPage structured data below. */
const FAQS = [
  {
    question: "Is UAF Notes Sharing App free to use?",
    answer:
      "Yes. The app is free for University of Agriculture Faisalabad students. There are no subscriptions, paid plans or hidden charges.",
  },
  {
    question: "Who can create an account?",
    answer:
      "Accounts are limited to UAF students who sign up with a valid AG number in the format 0000-AG-0000. Registration currently accepts the 2024 intake of the BSSE programme, in sections A and B. If your batch is not listed yet, you can still read the notes that are shared publicly.",
  },
  {
    question: "Do I need an account to read notes?",
    answer:
      "You can open the home page of the app without signing in, and that is where notes marked as public are listed. Uploading notes, managing your own material and opening notes shared with you always requires a student account.",
  },
  {
    question: "Who can see the notes I upload?",
    answer:
      "You choose the audience for every note. Public notes appear on the shared notes page for all visitors, shared notes are only visible to the classmates you share them with, and private notes are visible only to you.",
  },
  {
    question: "What file types can I upload and download?",
    answer:
      "Notes are stored as files, and the app shows the file type on each note card before you download it. PDF, Word documents, Excel sheets, images, text files and archives such as ZIP files are all supported.",
  },
  {
    question: "How are notes organised in the app?",
    answer:
      "Notes are grouped by section first (Section A and Section B) and then by course code. The current categories are Stat-402, Cs-406, Cs-408, Cs-410, Cs-412, Bms-402 and Is-402, plus an Announcements category for general updates.",
  },
  {
    question: "Can I use the app on my phone?",
    answer:
      "Yes. The app runs in a normal mobile browser, so it works on Android and iOS phones as well as on a laptop or desktop computer. No separate app needs to be installed.",
  },
  {
    question: "Is the app safe for my notes?",
    answer:
      "Your account is protected by a password, and notes you mark as private are not shown to other students. Please avoid uploading documents that contain personal or sensitive information, and use a password that you do not reuse on other websites.",
  },
  {
    question: "Is this the official University of Agriculture Faisalabad website?",
    answer:
      "No. UAF Notes Sharing App is an independent student project. It is not an official website of the University of Agriculture Faisalabad and it is not affiliated with or endorsed by the university.",
  },
  {
    question: "How do I report a problem or send feedback?",
    answer:
      "Use the WhatsApp, Facebook or LinkedIn links in the footer of the app. Please mention the note title or the page you were on so the problem can be found quickly.",
  },
];

const FAQ_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/faq#faq`,
      url: `${SITE_URL}/faq`,
      name: FAQ_TITLE,
      description: FAQ_DESCRIPTION,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/faq#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "FAQ",
          item: `${SITE_URL}/faq`,
        },
      ],
    },
  ],
};

const linkClass = "font-medium text-brand-600 hover:text-brand-700 hover:underline";

const FAQ = () => {
  return (
    <div className="bg-slate-50">
      <Seo
        title={`${FAQ_TITLE} | University of Agriculture Faisalabad`}
        description={FAQ_DESCRIPTION}
        path="/faq"
        structuredData={FAQ_STRUCTURED_DATA}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="transition-colors hover:text-brand-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-800" aria-current="page">
                FAQ
              </span>
            </li>
          </ol>
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 sm:px-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Common questions about accounts, note privacy and downloads on UAF
            Notes Sharing App. If your question is not answered here, the{" "}
            <Link to="/about" className={linkClass}>
              About page
            </Link>{" "}
            explains the app in more detail.
          </p>

          <div className="mt-8">
            {FAQS.map((item, index) => (
              <section
                key={item.question}
                className={`py-7 ${
                  index === 0 ? "pt-0" : "border-t border-slate-100"
                }`}
              >
                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {item.question}
                </h2>
                <p className="mt-2 leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </section>
            ))}
          </div>

          <p className="border-t border-slate-100 pt-6 text-sm text-slate-500">
            Still stuck? Something on the app not working? Send a message on the{" "}
            <a
              href="https://wa.me/923078244507"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              WhatsApp contact link
            </a>{" "}
            in the footer and it will be looked at.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
