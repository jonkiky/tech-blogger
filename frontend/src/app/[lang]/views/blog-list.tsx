import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia, formatDate } from "../utils/api-helpers";

interface Article {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    cover: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    category: {
      data: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    authors_bios: {
            data: Array<{
                id: number;
                attributes: {
                    name: string;
                    email: string;
                    createdAt: string;
                    updatedAt: string;
                };
            }> | null;
        } | null;
  };
}

export default function PostList({
  data: articles,
  children,
}: {
  data: Article[];
  children?: React.ReactNode;
}) {

  
  return (
    <section className="container p-6 mx-auto space-y-6 sm:space-y-12">
      <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const imageUrl = getStrapiMedia(
            article.attributes.cover.data?.attributes.url
          );

          const category = article.attributes.category.data?.attributes;
          const rawAuthorsBio = article.attributes.authors_bios?.data;
          const authorsBios = (rawAuthorsBio && rawAuthorsBio.length > 0) ? rawAuthorsBio: null;
          const firstAuthorsBio = (rawAuthorsBio && rawAuthorsBio.length > 0) ? rawAuthorsBio[0].attributes: null;

          const avatarUrl = getStrapiMedia(
            firstAuthorsBio?.avatar.data.attributes.url
          );
          return (
            <Link
              href={`/blog/${category?.slug}/${article.attributes.slug}`}
              key={article.id}
              className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-900 lg:w-[300px] xl:min-w-[375px] rounded-2xl overflow-hidden shadow-lg"
            >
              {imageUrl && (
                <Image
                  alt="presentation"
                  width="240"
                  height="240"
                  className="object-cover w-full h-44 "
                  src={imageUrl}
                />
              )}
              <div className="p-6 space-y-2 relative">
                {avatarUrl && (
                  <Image
                    alt="avatar"
                    width="80"
                    height="80"
                    src={avatarUrl}
                    className="rounded-full h-16 w-16 object-cover absolute -top-8 right-4"
                  />
                )}

                <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">
                  {article.attributes.title}
                </h3>

                <div className="flex justify-between items-center">
                  <span className="text-xs dark:text-gray-400">
                    {formatDate(article.attributes.publishedAt)}
                  </span>
                   <span className="text-xs dark:text-gray-400">
                  {authorsBios && authorsBios.length > 0 ? (
                      authorsBios.map((authorBio, index) => (
                        <span key={authorBio.id}>
                          {authorBio.attributes.name}
                          {index < authorsBios.length - 1 && " & "}
                        </span>
                      ))
                    ) : (
                      <span></span>
                    )}
                </span>
                </div>
                <p className="py-4">{article.attributes.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
      {children && children}
    </section>
  );
}
