import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
    heading: string;
    content: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({heading, content}) => {
      
    return (
        <Card>
            <CardHeader>
                <div className="felx items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-700 mr-4 flex-shrink-0 mt-1">
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 7 4 8 7 8Z" />
                        <path d="M14 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 7 4 8 7 8Z" />
                    </svg>
                </div>
                <CardTitle>{heading}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-start">
                    <blockquote className="text-md text-gray-700 dark:text-gray-300">
                        {content}
                    </blockquote>
                </div>
            </CardContent>
        </Card>
    );
}

export default FeatureCard;