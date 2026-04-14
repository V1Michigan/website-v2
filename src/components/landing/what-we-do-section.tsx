import ProgramCard from "../events/program-card";

export default function WhatWeDoSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
      <ProgramCard
        title="Product Studio"
        description="Build something you're passionate about in 8 weeks."
        imageSrc="/product-studio.jpg"
        href="https://v1michigan.com/apply?utm_source=website"
      />

      <ProgramCard
        title="Startup Week"
        description="Where the best startups hire the best talent."
        imageSrc="/startup-week.png"
        href="http://startupweek.v1michigan.com/"
      />

      {/* <ProgramCard */}
      {/*   title="Project North Star" */}
      {/*   description="Connect with partners, talk to customers, and raise capital." */}
      {/*   imageSrc="/build-blue-img.JPG" */}
      {/*   href="https://v1michigan.com/north-star" */}
      {/* /> */}

      <ProgramCard
        title="Ship-It"
        description="A workspace for engineers, tinkerers, and artists."
        imageSrc="/ship-its-img.JPG"
        href="https://v1michigan.com/ship-it"
      />
    </div>
  );
}
