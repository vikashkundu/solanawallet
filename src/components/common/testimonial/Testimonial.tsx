import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialProps {
    quote: string;
    image: string;
    name: string;
    title: string;
}

const Testimonial: React.FC<TestimonialProps> = ({quote, image, name, title}) => {
      
    const fallbackInitials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
    
    return (
    <Card className="flex flex-col justify-between">
      <CardContent>
        <div className="flex items-start">
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-700 mr-4 flex-shrink-0 mt-1">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 7 4 8 7 8Z"/>
              <path d="M14 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 7 4 8 7 8Z"/>
          </svg> */}
          <blockquote className="text-gray-700 italic dark:text-gray-300">
            "{quote}"
          </blockquote>
        </div>
      </CardContent>
      <CardFooter>
        <Avatar>
          <AvatarImage src={image} alt={`Photo of ${name}`} />
          <AvatarFallback>{fallbackInitials}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="font-bold text-gray-900 dark:text-gray-100">{name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        </div>
      </CardFooter>
    </Card>
    );
}

export default Testimonial;