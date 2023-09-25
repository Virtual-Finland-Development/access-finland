import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { Button, IconArrowRight, Text, Textarea } from 'suomifi-ui-components';
import { JmfRecommendation } from '@/types';
import useJmfRecommendations from '@/lib/hooks/use-jmf-recommendations';
import { useToast } from '@/context/toast-context';
import CustomHeading from '@/components/ui/custom-heading';
import Loading from '@/components/ui/loading';
import RecommendationItem from './recommendation-item';
import { convertRtfToPlainText, extractPdfTextContent } from './utils';

const FILE_TYPES = {
  pdf: 'application/pdf',
  txt: 'text/plain',
  rtf: 'text/rtf',
};

interface JmfRecommendationsSelectProps {
  type?: 'occupations' | 'skills' | 'both';
  isControlled: boolean;
  controlledSelected?: JmfRecommendation[];
  onSelect?: (selected: JmfRecommendation) => void;
  onSave: (selected?: JmfRecommendation[]) => void;
  onClose: () => void;
}

export default function JmfRecommendationsSelect(
  props: JmfRecommendationsSelectProps
) {
  const {
    type = 'both',
    isControlled,
    controlledSelected,
    onSelect,
    onSave,
    onClose,
  } = props;

  const [textContent, setTextContent] = useState<string | null>('');
  const [extractedTextContent, setExtractedTextContent] = useState<
    string | null
  >('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selected, setSelected] = useState<
    (JmfRecommendation & { delete?: boolean })[]
  >([]);

  // file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  // recommendations query
  const {
    data: recommendations,
    isFetching: recommendationsFetching,
    refetch: fetchRecommendations,
  } = useJmfRecommendations(textContent || extractedTextContent, {
    maxNumberOfSkills: type === 'both' ? 20 : type === 'occupations' ? 1 : 20,
    maxNumberOfOccupations: type === 'both' ? 7 : type === 'skills' ? 1 : 20,
  });

  // track extractedTextContent value and fetch recommendations when set
  useEffect(() => {
    if (extractedTextContent && !textContent) {
      fetchRecommendations();
    }
  }, [extractedTextContent, fetchRecommendations, textContent]);

  // track parent selected state, if component if controlled by parent
  useEffect(() => {
    if (isControlled && controlledSelected) {
      setSelected(controlledSelected);
    }
  }, [isControlled, controlledSelected]);

  // handle select / de-select recommendation
  // if component is controlled by parent update parent state, otherwise update inner state
  const handleSelect = useCallback(
    (recommendation: JmfRecommendation) => {
      if (isControlled && typeof onSelect === 'function') {
        onSelect(recommendation);
        return;
      }

      setSelected(prev => {
        let selected = [...prev];
        const isSelected =
          selected.findIndex(s => s.uri === recommendation.uri) > -1;

        if (isSelected) {
          selected = selected.filter(s => s.uri !== recommendation.uri);
        } else {
          selected.push(recommendation);
        }

        return selected;
      });
    },
    [isControlled, onSelect]
  );

  // handle save selections
  // if controlled by parent, pass no input
  // otherwise pass component inner selected state as input
  const handleSave = useCallback(() => {
    if (isControlled) {
      onSave();
    } else {
      onSave(selected);
    }
  }, [isControlled, onSave, selected]);

  // handle file select / parsing
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const fileReader = new FileReader();
      const file = e.target.files[0];

      setSelectedFileName(file.name);

      fileReader.onload = async () => {
        try {
          let extractedContent;

          if (file.type === FILE_TYPES.pdf) {
            extractedContent = await extractPdfTextContent(fileReader.result);
          } else if (file.type === FILE_TYPES.rtf) {
            extractedContent = await convertRtfToPlainText(
              fileReader.result as ArrayBuffer
            );
          } else {
            extractedContent = fileReader.result;
          }

          setTextContent(null);
          setExtractedTextContent(
            typeof extractedContent === 'string' ? extractedContent : null
          );
        } catch (error: any) {
          toast({
            status: 'error',
            title: 'Error',
            content: error?.message || 'Something went wrong.',
          });
        }
      };

      if (file.type === FILE_TYPES.txt) {
        fileReader.readAsText(file);
      } else if (file.type === FILE_TYPES.pdf || file.type === FILE_TYPES.rtf) {
        fileReader.readAsArrayBuffer(file);
      } else {
        toast({
          title: 'Not supported',
          content: 'This file format is not supported.',
          status: 'warning',
        });
      }
    }
  };

  // handle upload click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current?.click();
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 p-4 border border-gray-300 bg-suomifi-blue-bg-light w-full">
          <CustomHeading variant="h4">
            Please describe the occupations and skills you are looking for
          </CustomHeading>
          <Textarea
            className="!w-full"
            labelText="Add keywords for search. You will get keyword suggestions based on your text. Please choose the most suitable ones. You can also upload a text file or your CV (PDF)."
            hintText=""
            visualPlaceholder={
              selectedFileName ? `Using upload: ${selectedFileName}` : ''
            }
            value={textContent || ''}
            onChange={({ target }) => setTextContent(target.value)}
          />
          <div className="flex flex-row items-center mt-2 gap-3">
            <Button
              disabled={!textContent?.length || recommendationsFetching}
              onClick={() => fetchRecommendations()}
            >
              Select keywords
            </Button>
            <button
              type="button"
              className="flex flex-row items-center justify-center gap-1 text-base font-semibold text-blue-600 hover:text-blue-800 hover:underline visited:text-purple-600"
              onClick={handleUploadClick}
            >
              <FiUpload className="mt-1" /> Import your CV
            </button>
            <input
              hidden
              type="file"
              accept={Object.values(FILE_TYPES).join(', ')}
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>
        </div>

        {recommendationsFetching && <Loading />}

        {!recommendationsFetching && recommendations && (
          <div className="p-4 border border-gray-300 w-full">
            {['both', 'occupations'].includes(type) && (
              <div>
                <CustomHeading variant="h4">
                  Suggested occupations
                </CustomHeading>
                {recommendations.occupations.length ? (
                  <div className="flex flex-row flex-wrap gap-2 mt-2">
                    {recommendations.occupations.map(item => (
                      <RecommendationItem
                        type="occupation"
                        key={item.uri}
                        item={item}
                        isSelected={
                          selected.findIndex(
                            s => s.uri === item.uri && !s.delete
                          ) > -1
                        }
                        handleClick={() => handleSelect(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <Text className="!text-base">No suggestions found.</Text>
                )}
              </div>
            )}

            {['both', 'skills'].includes(type) && (
              <div>
                <CustomHeading variant="h4">Suggested skills</CustomHeading>
                {recommendations.skills.length ? (
                  <div className="flex flex-row flex-wrap gap-2 mt-2">
                    {recommendations.skills.map(item => (
                      <RecommendationItem
                        type="skill"
                        key={item.uri}
                        item={item}
                        isSelected={
                          selected.findIndex(
                            s => s.uri === item.uri && !s.delete
                          ) > -1
                        }
                        handleClick={() => handleSelect(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <Text className="!text-base">No suggestions found.</Text>
                )}
              </div>
            )}
          </div>
        )}

        {!isControlled && (
          <div className="flex flecx-row items-start gap-3">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              type="submit"
              disabled={!selected.length}
              iconRight={<IconArrowRight />}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
