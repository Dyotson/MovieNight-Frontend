"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMovieNight } from "@/lib/movie-night-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Copy } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export default function CreateMovieNight() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [limitProposals, setLimitProposals] = useState(false);
  const [maxProposals, setMaxProposals] = useState(5);
  const [limitVotes, setLimitVotes] = useState(false);
  const [maxVotesPerUser, setMaxVotesPerUser] = useState(3);
  const [token, setToken] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const handleCreate = async () => {
    if (!name || !date || !time) {
      toast.error("Missing information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      // 1. Crear la sesión utilizando la API
      const dateTime = new Date(date); // Combinar fecha y hora
      dateTime.setHours(
        parseInt(time.split(":")[0]),
        parseInt(time.split(":")[1])
      );

      const response = await createMovieNight({
        name,
        date: dateTime.toISOString(),
        maxProposals: limitProposals ? maxProposals : undefined,
        maxVotesPerUser: limitVotes ? maxVotesPerUser : undefined,
        username: "Host", // Opcional, puedes pedirle al usuario su nombre
      });

      // 2. Obtener token e invite link
      setToken(response.movieNight.token);
      setInviteLink(response.movieNight.inviteLink);

      // 3. Avanzar al siguiente paso
      setStep(2);
    } catch (error) {
      toast.error("Failed to create movie night", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Link copied!", {
      description: "The invite link has been copied to your clipboard.",
    });
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied!", {
      description: "The token has been copied to your clipboard.",
    });
  };

  const handleContinue = () => {
    router.push(`/night/${token}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[425px]">
          {step === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle>Create a Movie Night</DialogTitle>
                <DialogDescription>
                  Set up your movie night details. You'll get a link to share
                  with friends.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Movie Night Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Friday Fright Night"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="limit-proposals">
                      Limit movie proposals
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict how many movies each person can propose
                    </p>
                  </div>
                  <Switch
                    id="limit-proposals"
                    checked={limitProposals}
                    onCheckedChange={setLimitProposals}
                  />
                </div>
                {limitProposals && (
                  <div className="grid gap-2">
                    <Label htmlFor="max-proposals">
                      Maximum proposals per person
                    </Label>
                    <Input
                      id="max-proposals"
                      type="number"
                      min="1"
                      max="10"
                      value={maxProposals}
                      onChange={(e) =>
                        setMaxProposals(Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                )}

                {/* Nueva sección para limitar votos */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="space-y-0.5">
                    <Label htmlFor="limit-votes">Limit votes per user</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict how many votes each person can cast
                    </p>
                  </div>
                  <Switch
                    id="limit-votes"
                    checked={limitVotes}
                    onCheckedChange={setLimitVotes}
                  />
                </div>
                {limitVotes && (
                  <div className="grid gap-2">
                    <Label htmlFor="max-votes">Maximum votes per person</Label>
                    <Input
                      id="max-votes"
                      type="number"
                      min="1"
                      max="10"
                      value={maxVotesPerUser}
                      onChange={(e) =>
                        setMaxVotesPerUser(Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleCreate}>Create Movie Night</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Movie Night Created!</DialogTitle>
                <DialogDescription>
                  Save this information to access your movie night later. This
                  is the only time you'll see this!
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="token" className="font-semibold">
                    Your Movie Night Token
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="token"
                      value={token}
                      readOnly
                      className="font-mono text-center text-lg"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopyToken}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Save this token to access your movie night later.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invite-link" className="font-semibold">
                    Invite Link
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input id="invite-link" value={inviteLink} readOnly />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopyLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share this link with friends to invite them to your movie
                    night.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleContinue}>
                  Continue to Movie Night
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
