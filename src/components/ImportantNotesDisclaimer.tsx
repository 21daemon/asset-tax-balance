
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowDown, ArrowUp } from 'lucide-react';

const ImportantNotesDisclaimer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto text-left hover:bg-blue-100"
          >
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <span className="font-medium text-blue-900">Important Notes & Disclaimers</span>
            </div>
            {isOpen ? (
              <ArrowUp className="w-4 h-4 text-blue-600" />
            ) : (
              <ArrowDown className="w-4 h-4 text-blue-600" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.</span>
              </li>
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ImportantNotesDisclaimer;
