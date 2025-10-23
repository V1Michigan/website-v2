"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/utils/supabaseClient";
import type { Person } from "@/types/person";

export default function EditPersonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

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
    async function checkSessionAndFetch() {
      // Check if user is authenticated
      if (!user) {
        console.log('No user found, redirecting to auth');
        router.push("/auth");
        return;
      }

      // Verify session is still valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.log('Session invalid, redirecting to auth');
        router.push("/auth");
        return;
      }

      const personId = searchParams?.get('id');
      if (!personId) {
        console.log('No person ID found, redirecting to people');
        router.push("/people");
        return;
      }

      // Check if user is trying to edit their own profile
      if (session.user.id !== personId) {
        console.log('User trying to edit someone else\'s profile, redirecting to people');
        router.push("/people");
        return;
      }

      async function fetchPerson() {
        try {
          const { data, error } = await supabase
            .from('v1-people')
            .select('*')
            .eq('id', personId)
            .single();

          if (error) {
            console.error('Error fetching person:', error.message);
            router.push("/people");
            return;
          }

          if (!data) {
            console.log('Person not found, redirecting to people');
            router.push("/people");
            return;
          }

        // Map database fields to Person interface
        const mappedPerson: Person = {
          id: data.id,
          name: data.name,
          role: data.role,
          imageSrc: data['image-path'] || data.imageSrc || "/placeholder.svg",
          shortBio: data['short-bio'] || data.shortBio || "",
          fullBio: data['full-bio'] || data.fullBio || "",
          tags: data.tags || [],
          social: {
            linkedin: data.linkedin || "",
            twitter: data.twitter || "",
            instagram: data.instagram || "",
            website: data.website || "",
            email: data.email || "",
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
            email: mappedPerson.social.email || "",
          },
        });
        setTagsInput(mappedPerson.tags.join(", "));
      } catch (error) {
        console.error('Error fetching person:', error);
        router.push("/people");
      } finally {
        setLoading(false);
      }
    }

      fetchPerson();
    }

    checkSessionAndFetch();
  }, [user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Verify session is still valid before submitting
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        alert("Your session has expired. Please log in again.");
        router.push("/auth");
        return;
      }

      const personId = searchParams.get('id');
      if (!personId) {
        alert("Error: Person ID not found");
        setSaving(false);
        return;
      }

      // Double-check user is editing their own profile
      if (session.user.id !== personId) {
        alert("You can only edit your own profile.");
        router.push("/people");
        return;
      }

      // Prepare the update data, handling null values properly
      const updateData = {
        name: formData.name || null,
        role: formData.role || null,
        'short-bio': formData.shortBio || null,
        'full-bio': formData.fullBio || null,
        email: formData.social.email || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        linkedin: formData.social.linkedin || null,
        twitter: formData.social.twitter || null,
        instagram: formData.social.instagram || null,
        website: formData.social.website || null,
        'image-path': formData.imageSrc || null
      };
      console.log(updateData);

      // Remove null values to avoid overwriting with null
      const cleanedUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== null)
      );

      const { error } = await supabase
        .from('v1-people')
        .update(cleanedUpdateData)
        .eq('id', personId);

      if (error) {
        console.error('Error updating person:', error.message);
        alert(`Error updating profile: ${error.message}`);
        setSaving(false);
        return;
      }

      router.push("/people");
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      alert("An unexpected error occurred while updating your profile");
    } finally {
      setSaving(false);
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
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          setFormData(prev => ({ ...prev, imageSrc: result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
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
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => {
                      setTagsInput(e.target.value);
                      // Process tags when user types comma
                      if (e.target.value.includes(',')) {
                        const newTags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                        setFormData(prev => {
                          // Filter out duplicates (case-insensitive)
                          const existingTags = prev.tags.map(t => t.toLowerCase());
                          const uniqueNewTags = newTags.filter(tag => !existingTags.includes(tag.toLowerCase()));
                          return { ...prev, tags: [...prev.tags, ...uniqueNewTags] };
                        });
                        setTagsInput('');
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const newTags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
                        if (newTags.length > 0) {
                          setFormData(prev => {
                            // Filter out duplicates (case-insensitive)
                            const existingTags = prev.tags.map(t => t.toLowerCase());
                            const uniqueNewTags = newTags.filter(tag => !existingTags.includes(tag.toLowerCase()));
                            return { ...prev, tags: [...prev.tags, ...uniqueNewTags] };
                          });
                          setTagsInput('');
                        }
                      }
                    }}
                    placeholder="Engineering, Design, Product, Marketing, etc."
                  />
                  <p className="text-xs text-gray-500">
                    Type tags and add a comma to add them
                  </p>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 rounded-full bg-[#E9B872] px-3 py-1 text-xs font-medium text-gray-800">
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              const newTags = formData.tags.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, tags: newTags }));
                            }}
                            className="ml-1 hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Links (Optional)</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.social.linkedin}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        social: { ...prev.social, linkedin: e.target.value }
                      }))}
                      placeholder="https://linkedin.com/in/yourname (optional)"
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
                      placeholder="https://twitter.com/yourname (optional)"
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
                      placeholder="https://instagram.com/yourname (optional)"
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
                      placeholder="https://yourwebsite.com (optional)"
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
                      placeholder="your.email@example.com (optional)"
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
