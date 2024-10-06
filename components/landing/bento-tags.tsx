import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const badgeSet1 = [
  'Free Trial',
  'Enterprise Plan',
  'API Integration',
  '24/7 Support',
  'Multi-Tenant',
  'Cloud-Based',
  'Customizable Dashboard',
  'SLA Guarantee',
  'Real-Time Analytics',
  'Advanced Reporting',
  'Single Sign-On',
  'Mobile Support',
  'Product Updates',
  'Notifications',
  'Bug Tracking',
  'Custom Workflows',
  'Automation',
];

const badgeSet2 = [
  'Free Plan',
  'Pro Plan',
  'SSO',
  'GDPR Compliant',
  'Data Encryption',
  'Onboarding Support',
  'Team Collaboration',
  'Mobile App',
  'Custom Reports',
  'API Documentation',
  'Integrations',
  'User Permissions',
  'Live Chat',
  'Dedicated Account Manager',
  'Custom Branding',
  'Unlimited Users',
];

const badgeSet3 = [
  'Data Export',
  'Priority Support',
  'Billing Integration',
  'Customer Segmentation',
  'Sales Pipeline',
  'Email Marketing',
  'Lead Scoring',
  'Campaign Management',
  'Knowledge Base',
  'Video Tutorials',
  'Task Automation',
  'Two-Factor Authentication',
  'Audit Logs',
  'Custom Notifications',
  'Advanced Search',
  'Kanban Boards',
];

const badgeSet4 = [
  'Role-Based Access Control',
  'Performance Insights',
  'Multi-Language Support',
  'Usage Analytics',
  'Subscription Management',
  'Social Media Integration',
  'Single Sign-On (SSO)',
  'Discount Codes',
  'Webhooks',
  'Recurring Billing',
  'Team Management',
  'Task Management',
  'Resource Allocation',
  'Workforce Management',
  'Contract Management',
  'Knowledge Sharing',
];

const badgeSet5 = [
  'Meeting Scheduling',
  'File Sharing',
  'Document Collaboration',
  'Expense Tracking',
  'Invoice Automation',
  'Payroll Integration',
  'Custom Domains',
  'Admin Permissions',
  'Client Management',
  'Partner Portal',
  'Surveys',
  'Event Management',
  'Custom Templates',
  'AI-Powered Insights',
  'Data Visualization',
  'Custom Filters',
];

const badgeSet6 = [
  'Help Desk',
  'Incident Management',
  'Feedback Collection',
  'Uptime Monitoring',
  'Performance Reports',
  'Security Alerts',
  'Audit Trail',
  'Bug Fixes',
  'Feature Requests',
  'Performance Optimization',
  'Compliance Management',
  'Legal Contracts',
  'License Management',
  'Beta Program Access',
  'Patch Management',
  'Version Control',
];

export function BentoTags() {
  const [clickedBadge, setClickedBadge] = useState<string | null>(null);

  const handleBadgeClick = (badgeName: string) => {
    if (badgeName === clickedBadge) {
      setClickedBadge(null);
    } else {
      setClickedBadge(badgeName);
    }
  };

  const renderBadges = (badges: string[]) => {
    return badges.map((badge, index) => (
      <Badge
        key={index}
        variant={'default'}
        onClick={() => handleBadgeClick(badge)}
        className={`cursor-pointer ${
          clickedBadge === badge
            ? 'bg-cyan-600 hover:bg-cyan-600'
            : 'bg-black hover:bg-black dark:bg-gray-200'
        }`}
      >
        {badge}
      </Badge>
    ));
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex min-w-[200%] animate-scroll space-x-2 whitespace-nowrap">
        <div className="flex space-x-2">{renderBadges(badgeSet1)}</div>
      </div>
      <div className="flex min-w-[200%] animate-scroll space-x-2 whitespace-nowrap pt-2">
        <div className="flex space-x-2">{renderBadges(badgeSet2)}</div>
      </div>
      <div className="flex min-w-[200%] animate-scroll space-x-2 whitespace-nowrap pt-2">
        <div className="flex space-x-2">{renderBadges(badgeSet3)}</div>
      </div>
      <div className="flex min-w-[200%] animate-scroll space-x-2 whitespace-nowrap pt-2">
        <div className="flex space-x-2">{renderBadges(badgeSet4)}</div>
      </div>
      <div className="flex min-w-[200%] animate-scroll space-x-2 whitespace-nowrap pt-2">
        <div className="flex space-x-2">{renderBadges(badgeSet5)}</div>
      </div>
      <div className="flex min-w-[200%] animate-scroll space-x-2 whitespace-nowrap pt-2">
        <div className="flex space-x-2">{renderBadges(badgeSet6)}</div>
      </div>
    </div>
  );
}
