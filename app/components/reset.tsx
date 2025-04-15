import React from 'react'
import { Button } from "@/components/ui/button"
// import { useRouter } from 'next/router';
import { RotateCcw } from 'lucide-react';

const reset = () => {

    const handleFormSubmit = () => {
        window.location.reload();
    };

  return (
    <div className="py-3">
        <Button variant="secondary" onClick={handleFormSubmit}><RotateCcw />Reset</Button> 
    </div>
  )
}

export default reset
