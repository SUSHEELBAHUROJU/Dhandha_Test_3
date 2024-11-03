import React from 'react';
import { Shield, Store, Smartphone, BadgeCheck, CreditCard, BarChart3 } from 'lucide-react';

const features = [
  {
    name: 'Digital Khata Management',
    description: 'Maintain digital records of all credit transactions, eliminating paper-based bookkeeping.',
    icon: Smartphone,
  },
  {
    name: 'Payment Guarantee',
    description: 'Suppliers receive assured payments with our unique credit guarantee system.',
    icon: Shield,
  },
  {
    name: 'Business Analytics',
    description: 'Track business growth, payment patterns, and credit utilization with detailed insights.',
    icon: BarChart3,
  },
  {
    name: 'Multiple Payment Options',
    description: 'Support for UPI, bank transfers, and other digital payment methods for convenience.',
    icon: CreditCard,
  },
  {
    name: 'Retailer Network',
    description: 'Connect with verified retailers and expand your business network securely.',
    icon: Store,
  },
  {
    name: 'Credit Assessment',
    description: 'Advanced creditworthiness assessment powered by transaction history and AI.',
    icon: BadgeCheck,
  },
];

export default function Features() {
  return (
    <div className="py-12 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage credit
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            A complete digital solution for modern business credit management.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="ml-4 text-lg leading-6 font-medium text-gray-900">{feature.name}</h3>
                </div>
                <p className="mt-4 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}