import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const DashboardForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    dateOfPurchase: '',
    phoneNumber: '',
    gender: 'female',
    vehicleModel1: '',
    vehicleModel2: '',
    vehicleModel3: '',
    experience: '3-6 Months',
  });

  const navigate = useNavigate();
  const breadCrumb = [
    { name: 'Matter', href: '/dashboard', current: false },
    {
      name: "Driver's License Forms",
      href: '/dashboard/driver-license-forms',
      current: false,
    },
    {
      name: "Learner's Permit",
      href: '/dashboard/learners-permit',
      current: true,
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    // Handle cancel logic here
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              {breadCrumb.map((item, index) => (
                <BreadcrumbItem key={index}>
                  <Link to={item.href}>{item.name}</Link>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        {/* Form Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Learner's Permit Form
        </h1>

        <Card className="shadow-[0px_1px_3px_0px_#0051AF/10] border border-[#EAECF0] bg-white rounded-lg py-9 px-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Main Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange('firstName', e.target.value)
                  }
                  className="h-12 px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] backdrop-blur-[20px] bg-gradient-to-t from-[#E9E9E980]/50 to-[#FFFFFF0D]/5 text-sm placeholder:text-[#667085] py-1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  className="h-12 px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] backdrop-blur-[20px] bg-gradient-to-t from-[#E9E9E980]/50 to-[#FFFFFF0D]/5 text-sm placeholder:text-[#667085] py-1"
                />
              </div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="font-medium">
                  Date of Birth
                </Label>
                <div className="relative">
                  <Input
                    id="dateOfBirth"
                    type="date"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange('dateOfBirth', e.target.value)
                    }
                    className="h-12 px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] backdrop-blur-[20px] bg-gradient-to-t from-[#E9E9E980]/50 to-[#FFFFFF0D]/5 text-sm placeholder:text-[#667085] py-1"
                  />
                  <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfPurchase" className="font-medium">
                  Date of Purchase of Vehicle
                </Label>
                <div className="relative">
                  <Input
                    id="dateOfPurchase"
                    type="date"
                    placeholder="Date of Purchase of Vehicle"
                    value={formData.dateOfPurchase}
                    onChange={(e) =>
                      handleInputChange('dateOfPurchase', e.target.value)
                    }
                    className="h-12 px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] backdrop-blur-[20px] bg-gradient-to-t from-[#E9E9E980]/50 to-[#FFFFFF0D]/5 text-sm placeholder:text-[#667085] py-1"
                  />
                  <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Phone and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="font-medium">
                  Phone Number
                </Label>
                <div className="flex">
                  <div className="flex items-center bg-gray-50 border border-r-0 border-gray-200 rounded-l-md px-3 h-12">
                    <span className="text-sm text-gray-600">IND</span>
                    <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
                  </div>
                  <Input
                    id="phoneNumber"
                    placeholder="+91"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange('phoneNumber', e.target.value)
                    }
                    className="h-12 px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] backdrop-blur-[20px] bg-gradient-to-t from-[#E9E9E980]/50 to-[#FFFFFF0D]/5 text-sm placeholder:text-[#667085] py-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="others" id="others" />
                    <Label htmlFor="others">Others/Non-Binary</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Vehicle Model Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vehicleModel1" className="font-medium">
                  Model Number and Name of Vehicle
                </Label>
                <Textarea
                  id="vehicleModel1"
                  placeholder="Type Something..."
                  value={formData.vehicleModel1}
                  onChange={(e) =>
                    handleInputChange('vehicleModel1', e.target.value)
                  }
                  className="h-24 resize-none px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] backdrop-blur-[20px] bg-gradient-to-t from-[#E9E9E980]/50 to-[#FFFFFF0D]/5 text-sm placeholder:text-[#667085] py-1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleModel2" className="font-medium">
                  Model Number and Name of Vehicle
                </Label>
                <Textarea
                  id="vehicleModel2"
                  placeholder="Type Something..."
                  value={formData.vehicleModel2}
                  onChange={(e) =>
                    handleInputChange('vehicleModel2', e.target.value)
                  }
                  className="h-24 resize-none px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] backdrop-blur-[20px] bg-gradient-to-t from-[#E9E9E980]/50 to-[#FFFFFF0D]/5 text-sm placeholder:text-[#667085] py-1"
                />
              </div>
            </div>

            {/* Experience and Additional Vehicle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience" className="font-medium">
                  Experience
                </Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) =>
                    handleInputChange('experience', value)
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-6 Months">3-6 Months</SelectItem>
                    <SelectItem value="6-9 Months">6-9 Months</SelectItem>
                    <SelectItem value="9-12+ Months">9-12+ Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleModel3" className="font-medium">
                  Model Number and Name of Vehicle
                </Label>
                <Textarea
                  id="vehicleModel3"
                  placeholder="Type Something..."
                  value={formData.vehicleModel3}
                  onChange={(e) =>
                    handleInputChange('vehicleModel3', e.target.value)
                  }
                  className="h-24 resize-none px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] backdrop-blur-[20px] bg-gradient-to-t from-[#E9E9E980]/50 to-[#FFFFFF0D]/5 text-sm placeholder:text-[#667085] py-1"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 h-12"
              >
                Save and Next
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-8 py-3 h-12"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardForm;
