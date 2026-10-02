import { ResourceManager } from '@/components/app/ResourceManager';
import { RESOURCES } from '@/lib/resources';
export const metadata = { title: 'Goals' };
export default function Goals() { return <ResourceManager resource={RESOURCES.goals!} />; }
