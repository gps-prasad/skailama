"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useRef } from "react";
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
import useDebounceState from "../hooks/useDebounceState";


const TypeHead = ({profiles,selectedValues, setSelectedValues,multiSelect=true}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [createProfileName, setCreateProfileName] = useState("");
  const [profileName, setProfileName] = useState("");
  const debouncedProfileName = useDebounceState(profileName,500);

  useEffect(() => {
      dispatch(fetchProfiles(debouncedProfileName))
  }, [debouncedProfileName])

  const handleSelectItems = (id) => {
    if (!multiSelect) {
      const profile = profiles.find((profile) => profile._id === id);
      setSelectedValues([profile]);
    }
    else {
      if (selectedValues.find((item) => item._id === id)) {
        setSelectedValues(selectedValues.filter((item) => item._id !== id));
      } else {
        setSelectedValues([...selectedValues, profiles.find((profile) => profile._id === id)]);
      }
    }
  }

  const allSelected = typeof selectedValues !== 'Array' && selectedValues && selectedValues.length === profiles.length;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild style={{padding:'0px 8px'}}>
        <Button
          aria-expanded={open}
          className="min-w-[100px] w-[100%] justify-between"
          role="combobox"
          variant="outline"
        >
          {multiSelect ? <>{selectedValues.length > 0
            ? `${selectedValues.length} profile(s) selected`
            : "Select profiles..."}</> : selectedValues.length === 0 ? 'Select profile': selectedValues[0].name}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[100%] p-0">
        <Command style={{padding:'4px'}}>
            <div style={{border:'1px solid #ccc',padding:'3px 5px',borderRadius:'5px'}}>
            <input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Filter Profiles..." style={{height:'100%',width:'100%',outline:'none'}} />
            </div>
          <CommandList>
            <CommandEmpty className="h-[40px] text-center text-muted-foreground">No profiles found.</CommandEmpty>
            {multiSelect && profiles.length > 0 && <CommandGroup>
              <CommandItem
                style={{padding:'5px 3px'}}
                onSelect={() => {
                  if (allSelected) {
                    setSelectedValues([]);
                  } else {
                    setSelectedValues([...profiles]);
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
                  onSelect={(value) => handleSelectItems(value)}
                  value={profile._id}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      selectedValues.find((item) => item._id === profile._id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {profile.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="flex gap-1">
            <div style={{border:'1px solid #ccc',padding:'0px 5px',borderRadius:'5px'}}>
            <input value={createProfileName} onChange={(e) => setCreateProfileName(e.target.value)} placeholder="Add Profiles..." style={{height:'100%',width:'100%',outline:'none'}} />
            </div>
            <Button size="sm" onClick={() => {dispatch(createProfile(createProfileName)); setCreateProfileName('')}} style={{padding:'10px 5px'}}>ADD+</Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TypeHead;
