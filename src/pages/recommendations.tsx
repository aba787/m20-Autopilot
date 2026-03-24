import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Recommendations() {
  const router = useRouter();
  useEffect(() => { router.replace('/ai-engine'); }, []);
  return null;
}
