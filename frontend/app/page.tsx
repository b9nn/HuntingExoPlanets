import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  Brain, 
  Target, 
  Zap,
  ArrowRight,
  TestTube,
  Orbit
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                <Sparkles className="mr-1 h-3 w-3" />
                NASA Space Apps Challenge 2024
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                ExoAI
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Advanced AI-powered exoplanet discovery and classification system
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Using ensemble machine learning models to identify confirmed exoplanets, 
                candidates, and false positives with over 85% accuracy
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/classify">
                  <TestTube className="mr-2 h-4 w-4" />
                  Try Classifier
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why ExoAI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology for exoplanet research
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Accuracy >85%</CardTitle>
                <CardDescription>
                  Ensemble models achieve superior performance with stacking, 
                  random forest, and gradient boosting techniques
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Explainable AI</CardTitle>
                <CardDescription>
                  SHAP explanations provide insights into model decisions, 
                  helping researchers understand feature importance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multi-Mission Support</CardTitle>
                <CardDescription>
                  Compatible with Kepler, K2, and TESS mission data 
                  for comprehensive exoplanet analysis
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Technology Stack
            </h2>
            <p className="text-lg text-muted-foreground">
              Built with modern web technologies and ML frameworks
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Frontend</CardTitle>
                <CardDescription>
                  Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">3D Visualization</CardTitle>
                <CardDescription>
                  React Three Fiber, Three.js for interactive planet visualization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Machine Learning</CardTitle>
                <CardDescription>
                  Scikit-learn, ensemble methods, SHAP explanations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Data Processing</CardTitle>
                <CardDescription>
                  Pandas, NumPy for astronomical data analysis
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Discover Exoplanets?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start exploring our dashboard or try the interactive classifier 
              to see ExoAI in action
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  <Orbit className="mr-2 h-4 w-4" />
                  Explore Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/classify">
                  Start Classifying
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Built for NASA Space Apps Challenge 2024
            </p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://github.com/b9nn/HuntingExoPlanets" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub Repository
              </a>
              <a 
                href="https://spaceappschallenge.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Space Apps Challenge
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ExoAI Team. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
