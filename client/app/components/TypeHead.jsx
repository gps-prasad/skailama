"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { fetchProfiles, createProfile } from "../store/features/profilesSlice";
import { useEffect } from "react";
export const title = "With Select All Option";


const TypeHead = ({profiles,selectedValues, setSelectedValues}) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [createProfileName, setCreateProfileName] = useState("");
    const [profileName, setProfileName] = useState("");
    useEffect(() => {
        setTimeout(() => {
            dispatch(fetchProfiles(profileName))
        }, 500)
    }, [profileName])

  selectedValues = selectedValues.filter((p) => p !== "")
  const allSelected = selectedValues.length === profiles.length;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild style={{padding:'0px 8px'}}>
        <Button
          aria-expanded={open}
          className="w-[100%] justify-between"
          role="combobox"
          variant="outline"
        >
          {selectedValues.length > 0
            ? `${selectedValues.length} profile(s) selected`
            : "Select profiles..."}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100%] p-0">
        <Command>
            <div style={{border:'1px solid #ccc',padding:'3px 5px',borderRadius:'5px'}}>
            <input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Filter Profiles..." style={{height:'100%',width:'100%',outline:'none'}} />
            </div>
          <CommandList>
            <CommandEmpty>No profile found.</CommandEmpty>
            {profiles.length > 0 && <CommandGroup>
              <CommandItem
                style={{padding:'5px 3px'}}
                onSelect={() => {
                  if (allSelected) {
                    setSelectedValues([]);
                  } else {
                    setSelectedValues(profiles.map((p) => p._id));
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 size-4",
                    allSelected ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="font-medium">Select All</span>
              </CommandItem>
            </CommandGroup>}
            <CommandSeparator />
            <CommandGroup>
              {profiles?.map((profile) => (
                <CommandItem
                  style={{padding:'5px 3px'}}
                  key={profile._id}
                  onSelect={(currentValue) => {
                    setSelectedValues(
                      selectedValues.includes(currentValue)
                        ? selectedValues.filter((v) => v !== currentValue)
                        : [...selectedValues, currentValue]
                    );
                  }}
                  value={profile._id}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      selectedValues.includes(profile._id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {profile.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="flex">
            <div style={{border:'1px solid #ccc',padding:'0px 5px',borderRadius:'5px'}}>
            <input value={createProfileName} onChange={(e) => setCreateProfileName(e.target.value)} placeholder="Add Profiles..." style={{height:'100%',width:'100%',outline:'none'}} />
            </div>
            <Button onClick={() => {dispatch(createProfile(createProfileName))}} style={{padding:'10px 5px'}}>ADD+</Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TypeHead;
