"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PEOPLE } from "@/data/people";
import type { Person } from "@/types/person";

export default function EditPersonPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    imageSrc: "",
    shortBio: "",
    fullBio: "",
    tags: [] as string[],
    social: {
      linkedin: "",
      twitter: "",
      instagram: "",
      website: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    // Find the person by the logged-in user's email
    const foundPerson = PEOPLE.find(p => p.id === user.email);
    if (!foundPerson) {
      router.push("/people");
      return;
    }

    setPerson(foundPerson);
    setFormData({
      name: foundPerson.name,
      role: foundPerson.role,
      imageSrc: foundPerson.imageSrc,
      shortBio: foundPerson.shortBio,
      fullBio: foundPerson.fullBio,
      tags: foundPerson.tags,
      social: {
        linkedin: foundPerson.social.linkedin || "",
        twitter: foundPerson.social.twitter || "",
        instagram: foundPerson.social.instagram || "",
        website: foundPerson.social.website || "",
        email: foundPerson.social.email || "",
      },
    });
    setLoading(false);
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Here you would typically save to a database
    // For now, we'll just show a success message
    alert("Profile updated successfully! (Note: This is a demo - changes aren't persisted)");
    
    setSaving(false);
    router.push("/people");
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(",").map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEF9F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-[#FEF9F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <Button onClick={() => router.push("/people")} className="mt-4">
            Back to People
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEF9F5]">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your profile information for the V1 community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageSrc">Profile Image URL</Label>
                  <Input
                    id="imageSrc"
                    value={formData.imageSrc}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageSrc: e.target.value }))}
                    placeholder="/headshots/your-photo.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortBio">Short Bio</Label>
                  <Textarea
                    id="shortBio"
                    value={formData.shortBio}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortBio: e.target.value }))}
                    rows={2}
                    placeholder="Brief description of yourself"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullBio">Full Bio</Label>
                  <Textarea
                    id="fullBio"
                    value={formData.fullBio}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullBio: e.target.value }))}
                    rows={4}
                    placeholder="Detailed description of your background and interests"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags.join(", ")}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="Engineering, Design, Product, etc."
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Links</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.social.linkedin}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        social: { ...prev.social, linkedin: e.target.value }
                      }))}
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.social.twitter}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        social: { ...prev.social, twitter: e.target.value }
                      }))}
                      placeholder="https://twitter.com/yourname"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.social.instagram}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        social: { ...prev.social, instagram: e.target.value }
                      }))}
                      placeholder="https://instagram.com/yourname"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.social.website}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        social: { ...prev.social, website: e.target.value }
                      }))}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.social.email}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        social: { ...prev.social, email: e.target.value }
                      }))}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/people")}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
