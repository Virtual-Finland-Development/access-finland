import { Button, IconCheck, IconPlus } from 'suomifi-ui-components';
import { JmfRecommendation } from '@/types';

interface RecommendationItemProps {
  type: 'occupation' | 'skill';
  item: JmfRecommendation;
  isSelected: boolean;
  handleClick: (r: JmfRecommendation) => void;
}

export default function RecommendationItem(props: RecommendationItemProps) {
  const { type, item, isSelected, handleClick } = props;

  return (
    <Button
      key={item.label}
      variant={isSelected ? 'default' : 'secondary'}
      iconRight={isSelected ? <IconCheck /> : <IconPlus />}
      onClick={() => handleClick(item)}
    >
      {item.label}
    </Button>
  );
}
