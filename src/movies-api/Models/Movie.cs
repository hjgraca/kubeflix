using System.Collections.Generic;
using System.Text.Json.Serialization;

// public class Movie
// {
//     [JsonPropertyName("backdrop_path")]
//     public string BackdropPath { get; set; }

//     [JsonPropertyName("genre_ids")]
//     public List<int> GenreIds { get; set; }

//     [JsonPropertyName("id")]
//     public int Id { get; set; }

//     [JsonPropertyName("original_language")]
//     public string OriginalLanguage { get; set; }

//     [JsonPropertyName("original_title")]
//     public string OriginalTitle { get; set; }

//     [JsonPropertyName("overview")]
//     public string Overview { get; set; }

//     [JsonPropertyName("popularity")]
//     public double Popularity { get; set; }

//     [JsonPropertyName("poster_path")]
//     public string PosterPath { get; set; }

//     [JsonPropertyName("release_date")]
//     public string ReleaseDate { get; set; }

//     [JsonPropertyName("title")]
//     public string Title { get; set; }

//     [JsonPropertyName("vote_average")]
//     public double VoteAverage { get; set; }

//     [JsonPropertyName("vote_count")]
//     public int VoteCount { get; set; }
// }

public class Genre
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }
}

public class Cast
{
    [JsonPropertyName("adult")]
    public bool Adult { get; set; }

    [JsonPropertyName("gender")]
    public int Gender { get; set; }

    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("known_for_department")]
    public string KnownForDepartment { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("original_name")]
    public string OriginalName { get; set; }

    [JsonPropertyName("popularity")]
    public double Popularity { get; set; }

    [JsonPropertyName("profile_path")]
    public string ProfilePath { get; set; }

    [JsonPropertyName("cast_id")]
    public int CastId { get; set; }

    [JsonPropertyName("character")]
    public string Character { get; set; }

    [JsonPropertyName("credit_id")]
    public string CreditId { get; set; }

    [JsonPropertyName("order")]
    public int Order { get; set; }
}

public class Movie
{
    [JsonPropertyName("adult")]
    public bool Adult { get; set; }

    [JsonPropertyName("backdrop_path")]
    public string BackdropPath { get; set; }

    [JsonPropertyName("belongs_to_collection")]
    public object BelongsToCollection { get; set; }

    [JsonPropertyName("budget")]
    public int Budget { get; set; }

    [JsonPropertyName("genres")]
    public List<Genre> Genres { get; set; }

    [JsonPropertyName("homepage")]
    public string Homepage { get; set; }

    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("imdb_id")]
    public string ImdbId { get; set; }

    [JsonPropertyName("original_language")]
    public string OriginalLanguage { get; set; }

    [JsonPropertyName("original_title")]
    public string OriginalTitle { get; set; }

    [JsonPropertyName("overview")]
    public string Overview { get; set; }

    [JsonPropertyName("popularity")]
    public double Popularity { get; set; }

    [JsonPropertyName("poster_path")]
    public string PosterPath { get; set; }

    [JsonPropertyName("release_date")]
    public string ReleaseDate { get; set; }

    [JsonPropertyName("runtime")]
    public int Runtime { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; }

    [JsonPropertyName("tagline")]
    public string Tagline { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("video")]
    public bool Video { get; set; }

    [JsonPropertyName("vote_average")]
    public double VoteAverage { get; set; }

    [JsonPropertyName("vote_count")]
    public int VoteCount { get; set; }

    [JsonPropertyName("cast")]
    public List<Cast> Cast { get; set; }
}