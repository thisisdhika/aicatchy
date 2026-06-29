'use client';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@ac/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">AICatchy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mobile-first AI fashion decision app for Indonesian Gen Z/young Millennials.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Safe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Curated for everyday comfort and versatility.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Stylish</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Trend-forward looks with cultural nuance.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Bolder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Statement pieces for memorable moments.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 text-center">
          <Button size="lg">Start Generating Outfits</Button>
        </section>
      </main>
    </div>
  );
}