import { ReviewSecurityTest } from '@/src/components/review-security-test';
import { Navbar } from '@/src/components/navbar/navbar';
import { Footer } from '@/src/components/footer';

export default function SecurityTestPage() {
  return (
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-color_text mb-8">Review Security Testing</h1>
          <p className="text-color_text_sec mb-8">
            This page tests the security measures implemented for review content. 
            It demonstrates how malicious content is filtered and safe content is preserved.
          </p>
          
          <ReviewSecurityTest />
        </div>
      </div>
      
      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
} 