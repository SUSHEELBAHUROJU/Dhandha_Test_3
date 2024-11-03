import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Retailer Registration',
    description: 'Retailers sign up and undergo a comprehensive creditworthiness assessment.',
  },
  {
    id: 2,
    title: 'Credit Approval',
    description: 'Our fintech partners evaluate and approve credit limits based on assessment.',
  },
  {
    id: 3,
    title: 'Supplier Connection',
    description: 'Approved retailers connect with suppliers on the platform.',
  },
  {
    id: 4,
    title: 'Guaranteed Transactions',
    description: 'Suppliers provide credit with confidence, backed by our guarantee.',
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-gray-50 py-12" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Process</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            A simple, transparent process to build trust between suppliers and retailers.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10">
            {steps.map((step, stepIdx) => (
              <div key={step.id} className="relative">
                <div className="relative flex items-center space-x-4">
                  <div>
                    <span className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center ring-8 ring-white">
                      <span className="text-lg font-medium text-white">{step.id}</span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                    <p className="text-base text-gray-500">{step.description}</p>
                  </div>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute left-5 top-12 h-8 w-0.5 bg-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}