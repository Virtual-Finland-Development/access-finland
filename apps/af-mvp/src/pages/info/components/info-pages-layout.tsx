import { ReactNode } from 'react';
import useDimensions from '@shared/lib/hooks/use-dimensions';
import Page from '@shared/components/layout/page';
import InfoNavigation from '../components/info-navigation';

interface InfoPagesLayoutProps {
  title: string;
  children: ReactNode;
}

export default function InfoPagesLayout(props: InfoPagesLayoutProps) {
  const { title, children } = props;
  const { width } = useDimensions();

  return (
    <Page title={title} showHeading={width > 1024}>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:shrink-0 bg-white">
          <InfoNavigation />
        </div>
        <Page.Block className="bg-white grow border-l">
          <div className="lg:-mx-10">{children}</div>
        </Page.Block>
      </div>
    </Page>
  );
}
