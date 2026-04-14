"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/db/supabaseClient";
import type { Person } from "@/types/person";

export default function EditPersonPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("");

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
    },
  });

  useEffect(() => {
    async function fetchPerson() {
      if (!user) {
        router.push("/auth");
        return;
      }

      try {
        const { data, error } = await supabase
          .from('v1-people')
          .select('id, name, short-bio, full-bio, tags, linkedin, twitter, instagram, website, role, image-path')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching person:', error.message);
          router.push("/people");
          return;
        }

        if (!data) {
          router.push("/people");
          return;
        }

        // Map database fields to Person interface
        const mappedPerson: Person = {
          id: data.id,
          name: data.name,
          role: data.role,
          imageSrc: data['image-path'] || "/placeholders/general/placeholder.svg",
          shortBio: data['short-bio'] || "",
          fullBio: data['full-bio'] || "",
          tags: data.tags || [],
          social: {
            linkedin: data.linkedin || "",
            twitter: data.twitter || "",
            instagram: data.instagram || "",
            website: data.website || "",
          },
        };

        setPerson(mappedPerson);
        setFormData({
          name: mappedPerson.name,
          role: mappedPerson.role,
          imageSrc: mappedPerson.imageSrc,
          shortBio: mappedPerson.shortBio,
          fullBio: mappedPerson.fullBio,
          tags: mappedPerson.tags,
          social: {
            linkedin: mappedPerson.social.linkedin || "",
            twitter: mappedPerson.social.twitter || "",
            instagram: mappedPerson.social.instagram || "",
            website: mappedPerson.social.website || "",
          },
        });
        setTagsInput(mappedPerson.tags.join(", "));
      } catch (error) {
        console.error('Unexpected error fetching person:', error);
        router.push("/people");
      } finally {
        setLoading(false);
      }
    }

    fetchPerson();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (!person?.id) {
      //alert("Error: No person ID found");
      setSaving(false);
      return;
    }

    try {
      // Handle image upload if a new image was selected
      let imagePath = formData.imageSrc;
      if (imageFile) {
        // Convert file to base64 for storage
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
        
        const base64Data = await base64Promise;
        
        // For now, we'll store the base64 data in the database
        // In a production app, you'd upload to a file storage service
        imagePath = base64Data;
      }

      const { error } = await supabase
        .from('v1-people')
        .update({
          name: formData.name,
          role: formData.role,
          'short-bio': formData.shortBio,
          'full-bio': formData.fullBio,
          tags: formData.tags,
          linkedin: formData.social.linkedin,
          twitter: formData.social.twitter,
          instagram: formData.social.instagram,
          website: formData.social.website,
          'image-path': imagePath
        })
        .eq('id', person.id);

      if (error) {
        console.error('Error updating profile:', error.message);
        //alert("Error updating profile: " + error.message);
      } else {
        //alert("Profile updated successfully!");
        router.push("/people");
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      //alert("An unexpected error occurred");
    }
    
    setSaving(false);
  };

  const handleTagsInputChange = (value: string) => {
    setTagsInput(value);
  };

  const processTags = () => {
    // Split by comma and clean up each tag
    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0) // Remove empty tags
      .map(tag => tag.replace(/[^a-zA-Z0-9\s-]/g, '')) // Remove special chars except spaces and hyphens
      .filter(tag => tag.length > 0); // Filter again after cleaning
    
    setFormData(prev => ({ ...prev, tags }));
    setTagsInput(tags.join(", ")); // Update input to show cleaned version
  };

  const handleTagsKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processTags();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Generate filename based on user ID and update form data
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const filename = `${user?.id || 'user'}.${fileExtension}`;
      setFormData(prev => ({ ...prev, imageSrc: `/headshots/${filename}` }));
    }
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
                  <Label htmlFor="imageFile">Profile Image</Label>
                  <div className="space-y-4">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {(imagePreview || formData.imageSrc) && (
                      <div className="mt-4">
                        <img
                          src={imagePreview || formData.imageSrc}
                          alt="Profile preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                      </div>
                    )}
                  </div>
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
                    value={tagsInput}
                    onChange={(e) => handleTagsInputChange(e.target.value)}
                    onBlur={processTags}
                    onKeyPress={handleTagsKeyPress}
                    placeholder="Engineering, Design, Product, etc."
                    className="mb-2"
                  />
                  <div className="text-sm text-gray-600">
                    <p>Enter tags separated by commas. Press Enter or click away to process. Special characters will be removed.</p>
                    {formData.tags.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Current tags:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
