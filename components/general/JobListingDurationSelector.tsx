import { ControllerRenderProps } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { jobListingDurationPricing } from "@/app/utils/jobListingDurationPricing";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface iAppProps {
  field: ControllerRenderProps;
}

export function JobListingDuration({ field }: iAppProps) {
  return (
    <RadioGroup
      value={field.value?.toString()}
      onValueChange={(value) => {
        // Add logging to verify the change is triggered
        console.log("Selected duration:", value);
        field.onChange(parseInt(value));
      }}
      className="flex flex-col gap-4"
    >
      {jobListingDurationPricing.map((duration) => (
        <div key={duration.days} className="relative">
          <Label
            htmlFor={`duration-${duration.days}`}
            className="flex flex-col cursor-pointer w-full"
          >
            <Card
              className={cn(
                field.value === duration.days
                  ? "border-primary bg-primary/10"
                  : "hover:bg-secondary/50",
                "p-4 border-2 transition-all"
              )}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{duration.days} Days</p>
                  <p className="text-sm text-muted-foreground">
                    {duration.description}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-xl">${duration.price}</p>
                  <p className="text-sm text-muted-foreground">
                    ${(duration.price / duration.days).toFixed(2)}/days
                  </p>
                </div>
              </div>
            </Card>
            <RadioGroupItem
              value={duration.days.toString()}
              id={`duration-${duration.days}`}
              className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
            />
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}