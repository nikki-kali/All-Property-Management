import SectionHeading from './SectionHeading';
import StatBlock from './StatBlock';
import { StaggerGroup, StaggerItem } from '../motion/StaggerGroup';

export default function SocialProof({ title = 'Trusted across the metro', subtitle, stats }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title={title} subtitle={subtitle} />
        <StaggerGroup className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <StatBlock value={stat.value} label={stat.label} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
