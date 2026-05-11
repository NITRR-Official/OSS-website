import { Research } from "@/types/research";
import { ResearchesClient } from "@/components/researches/ResearchesClient";
import { Container } from "@/components/layout/Container";
import researches from "@/data/researches.json";

export const metadata = {
  title: "Research Papers - NITRR OSS",
  description: "Explore research papers and publications from our open-source projects",
};

export default function ResearchesPage() {
  const researchData: Research[] = researches;

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Research Papers</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore academic research and publications from our open-source projects. Our community
          members regularly publish their findings in conferences and journals.
        </p>
      </div>

      {/* Content */}
      <ResearchesClient researches={researchData} />
    </Container>
  );
}
