/**
 * Skills Marketplace - Skill Metadata Schema
 * 
 * Defines the standardized schema for skill metadata across all sources.
 */

// Supported skill sources
const SkillSource = {
  CLAWHUB: 'clawhub',
  GITHUB: 'github',  
  NPM: 'npm',
  SKILLS_SH: 'skills_sh',
  LOCAL: 'local'
};

/**
 * Standardized skill metadata schema
 */
class SkillMetadata {
  constructor({
    // Basic identification
    name,
    id, // Unique identifier (source/slug format)  
    version,
    source,
    
    // Descriptive information
    title,
    description,
    categories = [],
    tags = [],
    
    // Technical details
    repositoryUrl,
    homepageUrl = null,
    documentationUrl = null,
    license = null,
    
    // Installation & usage
    installCommand,
    dependencies = [],
    compatibility = [], // Supported platforms/versions
    
    // Quality & safety
    securityAuditPassed = false,
    auditResults = {},
    rating = 0.0,
    downloadCount = 0,
    
    // Marketplace specific
    isPremium = false,
    price = null,
    currency = 'USD',
    author = '',
    createdAt = '',
    updatedAt = ''
  }) {
    this.name = name;
    this.id = id;
    this.version = version;
    this.source = source;
    this.title = title;
    this.description = description;
    this.categories = categories;
    this.tags = tags;
    this.repositoryUrl = repositoryUrl;
    this.homepageUrl = homepageUrl;
    this.documentationUrl = documentationUrl;
    this.license = license;
    this.installCommand = installCommand;
    this.dependencies = dependencies;
    this.compatibility = compatibility;
    this.securityAuditPassed = securityAuditPassed;
    this.auditResults = auditResults;
    this.rating = rating;
    this.downloadCount = downloadCount;
    this.isPremium = isPremium;
    this.price = price;
    this.currency = currency;
    this.author = author;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Convert to plain object for JSON serialization
   */
  toJSON() {
    return {
      name: this.name,
      id: this.id,
      version: this.version,
      source: this.source,
      title: this.title,
      description: this.description,
      categories: this.categories,
      tags: this.tags,
      repositoryUrl: this.repositoryUrl,
      homepageUrl: this.homepageUrl,
      documentationUrl: this.documentationUrl,
      license: this.license,
      installCommand: this.installCommand,
      dependencies: this.dependencies,
      compatibility: this.compatibility,
      securityAuditPassed: this.securityAuditPassed,
      auditResults: this.auditResults,
      rating: this.rating,
      downloadCount: this.downloadCount,
      isPremium: this.isPremium,
      price: this.price,
      currency: this.currency,
      author: this.author,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = {
  SkillSource,
  SkillMetadata
};