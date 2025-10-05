import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Info, 
  Users, 
  Target, 
  Brain, 
  Database, 
  Github,
  ExternalLink,
  Sparkles,
  Zap
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Info className="mr-3 h-8 w-8 text-primary" />
          About ExoAI
        </h1>
        <p className="text-muted-foreground">
          Learn about our mission, technology, and the team behind ExoAI
        </p>
      </div>

      {/* Mission Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            ExoAI is an advanced artificial intelligence system designed to revolutionize exoplanet discovery and classification. 
            Our mission is to accelerate the search for habitable worlds and advance our understanding of planetary systems 
            through cutting-edge machine learning techniques.
          </p>
        </CardContent>
      </Card>

      {/* Technology Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              AI Technology
            </CardTitle>
            <CardDescription>
              Advanced machine learning for exoplanet analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Ensemble Methods</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stacking Ensemble (87% accuracy)</li>
                <li>• Random Forest Classifier</li>
                <li>• Extra Trees Classifier</li>
                <li>• Random Subspace Method</li>
                <li>• AdaBoost Classifier</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Explainable AI</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SHAP (SHapley Additive exPlanations)</li>
                <li>• Feature importance analysis</li>
                <li>• Local and global explanations</li>
                <li>• Model interpretability</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Data Sources
            </CardTitle>
            <CardDescription>
              Multi-mission exoplanet datasets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Space Missions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Kepler:</strong> 2009-2018, 2,662 confirmed exoplanets</li>
                <li>• <strong>K2:</strong> 2014-2018, 500+ confirmed exoplanets</li>
                <li>• <strong>TESS:</strong> 2018-present, 6,000+ candidates</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Key Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Orbital period and duration</li>
                <li>• Transit depth and planetary radius</li>
                <li>• Stellar temperature and radius</li>
                <li>• Surface gravity and metallicity</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Model performance across different evaluation metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">87%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">85%</div>
              <div className="text-sm text-muted-foreground">Precision</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">86%</div>
              <div className="text-sm text-muted-foreground">Recall</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-muted-foreground">F1 Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Development Team
          </CardTitle>
          <CardDescription>
            Built for NASA Space Apps Challenge 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              ExoAI was developed as part of the NASA Space Apps Challenge 2025, bringing together 
              experts in machine learning, astronomy, and software development to create an innovative 
              solution for exoplanet discovery and analysis.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Machine Learning</Badge>
              <Badge variant="outline">Astronomy</Badge>
              <Badge variant="outline">Data Science</Badge>
              <Badge variant="outline">Web Development</Badge>
              <Badge variant="outline">3D Visualization</Badge>
              <Badge variant="outline">NASA Space Apps</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            Technology Stack
          </CardTitle>
          <CardDescription>
            Modern technologies powering ExoAI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h4 className="font-medium">Frontend</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 14 (App Router)</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• shadcn/ui</li>
                <li>• React Three Fiber</li>
                <li>• TanStack Table</li>
                <li>• Recharts</li>
                <li>• Framer Motion</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Backend & ML</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Python</li>
                <li>• Scikit-learn</li>
                <li>• Pandas & NumPy</li>
                <li>• SHAP</li>
                <li>• FastAPI/Flask</li>
                <li>• Jupyter Notebooks</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Data & Visualization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Kepler/K2/TESS Data</li>
                <li>• Three.js</li>
                <li>• D3.js (via Recharts)</li>
                <li>• CSV Export/Import</li>
                <li>• Real-time 3D Rendering</li>
                <li>• Interactive Charts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links and Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resources & Links</CardTitle>
          <CardDescription>
            Learn more about exoplanet research and our project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Project Resources</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/b9nn/HuntingExoPlanets" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub Repository
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://spaceappschallenge.org/" target="_blank" rel="noopener noreferrer">
                    <Sparkles className="mr-2 h-4 w-4" />
                    NASA Space Apps
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Exoplanet Resources</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://exoplanetarchive.ipac.caltech.edu/" target="_blank" rel="noopener noreferrer">
                    <Database className="mr-2 h-4 w-4" />
                    NASA Exoplanet Archive
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://kepler.nasa.gov/" target="_blank" rel="noopener noreferrer">
                    <Target className="mr-2 h-4 w-4" />
                    Kepler Mission
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Ready to Explore Exoplanets?</h3>
            <p className="text-muted-foreground">
              Start using ExoAI to discover and classify exoplanets with the power of AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/classify">
                  <Target className="mr-2 h-4 w-4" />
                  Try the Classifier
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <Brain className="mr-2 h-4 w-4" />
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
