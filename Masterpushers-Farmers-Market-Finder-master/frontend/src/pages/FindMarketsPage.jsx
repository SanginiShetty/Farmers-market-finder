import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, MapPin, Clock, Calendar, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Sample data
const marketData = [
  {
    id: 1,
    name: "Downtown Farmers Market",
    address: "123 Main St, Anytown",
    distance: 1.2,
    rating: 4.8,
    hours: "8:00 AM - 1:00 PM",
    days: ["Saturday", "Sunday"],
    features: ["Organic", "Handicrafts", "Food Trucks", "Live Music"],
    image: "/api/placeholder/300/200",
    description: "A vibrant market in the heart of downtown featuring over 50 local vendors offering fresh produce, artisan goods, and prepared foods."
  },
  {
    id: 2,
    name: "Riverside Market",
    address: "456 River Rd, Anytown",
    distance: 3.5,
    rating: 4.6,
    hours: "10:00 AM - 3:00 PM",
    days: ["Wednesday", "Saturday"],
    features: ["Organic", "EBT Accepted", "Pet Friendly"],
    image: "/api/placeholder/300/200",
    description: "Located along the scenic riverfront, this market specializes in locally grown produce and dairy products from farms within 30 miles."
  },
  {
    id: 3,
    name: "Hillside Community Market",
    address: "789 Oak Ave, Anytown",
    distance: 4.8,
    rating: 4.3,
    hours: "9:00 AM - 2:00 PM",
    days: ["Thursday"],
    features: ["Organic", "EBT Accepted", "Children's Activities"],
    image: "/api/placeholder/300/200",
    description: "A community-focused market supporting small-scale farmers and featuring educational workshops on sustainable agriculture."
  },
  {
    id: 4,
    name: "Eastside Growers Exchange",
    address: "101 Pine Lane, Anytown",
    distance: 6.7,
    rating: 4.9,
    hours: "8:00 AM - 12:00 PM",
    days: ["Sunday"],
    features: ["Organic", "Rare Varieties", "Plant Starts"],
    image: "/api/placeholder/300/200",
    description: "A favorite among gardeners and chefs, featuring heirloom vegetables, rare fruit varieties, and unique culinary herbs."
  }
];

const FindMarketsPage = () => {
  const [distance, setDistance] = useState([15]);
  const [selectedDay, setSelectedDay] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filter Panel */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Find Markets</CardTitle>
            <CardDescription>Filter to find the perfect market</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <Input 
                  id="location" 
                  placeholder="Enter your location" 
                  className="pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Distance</Label>
                <span className="text-sm text-gray-500">{distance}mi</span>
              </div>
              <Slider
                defaultValue={[15]}
                max={50}
                step={1}
                value={distance}
                onValueChange={setDistance}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="day">Day of Week</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger id="day">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Day</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="features">
                <AccordionTrigger>Features</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-2">
                    {["Organic", "EBT Accepted", "Pet Friendly", "Handicrafts", "Food Trucks", "Live Music", "Children's Activities"].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <input type="checkbox" id={feature} className="h-4 w-4 text-green-600 focus:ring-green-500" />
                        <label htmlFor={feature} className="text-sm">{feature}</label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700">Apply Filters</Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Results */}
      <div className="lg:col-span-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">4 Markets Found</h2>
          <Select defaultValue="distance">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketData.map((market) => (
            <Card key={market.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={market.image} 
                  alt={market.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-xl">{market.name}</CardTitle>
                  <div className="flex items-center text-amber-500">
                    <Star className="fill-amber-500 h-4 w-4" />
                    <span className="ml-1">{market.rating}</span>
                  </div>
                </div>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {market.address} ({market.distance} miles)
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-2">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock className="h-4 w-4 mr-1" /> {market.hours}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" /> {market.days.join(", ")}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {market.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">Details</Button>
                <Button className="bg-green-600 hover:bg-green-700">Directions</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindMarketsPage;